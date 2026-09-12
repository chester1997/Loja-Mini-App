import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { createPixCharge } from "@/lib/cora";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentId, cpfCnpj } = await req.json(); // Added cpfCnpj for the boleto/PIX creation

    if (!contentId) {
      return NextResponse.json({ error: "Missing contentId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const content = await prisma.content.findUnique({ where: { id: contentId } });
    if (!content || !content.active) {
      return NextResponse.json({ error: "Content not available" }, { status: 404 });
    }

    // Check if already paid
    const existingPaid = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        contentId: content.id,
        status: "paid"
      }
    });

    if (existingPaid) {
      return NextResponse.json({ 
        error: "Content already purchased", 
        purchaseId: existingPaid.id,
        status: "paid"
      }, { status: 400 });
    }

    // For MVP, we will reuse a pending purchase if it exists, or create a new one
    let purchase = await prisma.purchase.findFirst({
      where: { userId: user.id, contentId: content.id, status: "pending" }
    });

    if (!purchase) {
      purchase = await prisma.purchase.create({
        data: {
          userId: user.id,
          contentId: content.id,
          amount: content.price || 0,
          status: "pending"
        }
      });
    }

    const amountInCents = Math.round(Number(content.price || 0) * 100);
    const idempotencyKey = randomUUID();

    console.log(`[Payment] Creating Cora PIX for purchase ${purchase.id}`);

    // Call Cora API
    // In a real scenario we'd get customer CPF from a profile form, here we use a dummy if not provided or what's sent
    const charge = await createPixCharge({
      amountInCents,
      internalCode: purchase.id,
      customerName: user.name || "Cliente Lojinha",
      customerEmail: user.email || "contato@miniapp.com",
      customerCpfCnpj: cpfCnpj || "00000000000", // Needs valid format in prod
      idempotencyKey
    });

    const pixPayment = charge.payment_options?.pix;

    // Save payment attempt
    const payment = await prisma.payment.create({
      data: {
        purchaseId: purchase.id,
        userId: user.id,
        provider: "cora",
        providerPaymentId: charge.id,
        amount: content.price || 0,
        status: "pending",
        pixCopyPaste: pixPayment?.emv,
        qrCodeUrl: pixPayment?.qr_code,
        idempotencyKey
      }
    });

    return NextResponse.json({
      purchaseId: purchase.id,
      paymentId: payment.id,
      status: payment.status,
      amount: payment.amount,
      pixCopyPaste: payment.pixCopyPaste,
      qrCodeUrl: payment.qrCodeUrl
    });
  } catch (error: any) {
    console.error("[Payment Error] ", error?.response?.data || error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
