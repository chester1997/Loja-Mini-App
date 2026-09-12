import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getPixCharge } from "@/lib/cora";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const purchase = await prisma.purchase.findUnique({
      where: { id: resolvedParams.purchaseId },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    if (!purchase || purchase.userId !== user.id) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // If local status is already paid, return early to avoid extra calls
    if (purchase.status === "paid") {
      return NextResponse.json({ status: "paid" });
    }

    const latestPayment = purchase.payments[0];

    // If there's a pending payment, we can optionally check the Cora API if we don't fully rely on webhooks
    // But since the spec asks to sync status:
    if (latestPayment && latestPayment.status === "pending") {
      try {
        const coraCharge = await getPixCharge(latestPayment.providerPaymentId);
        
        let newStatus = latestPayment.status;
        const coraStatus = coraCharge.status; // OPEN, IN_PAYMENT, PAID, LATE, CANCELLED

        if (coraStatus === "PAID") newStatus = "paid";
        else if (coraStatus === "LATE") newStatus = "expired";
        else if (coraStatus === "CANCELLED") newStatus = "cancelled";

        if (newStatus !== latestPayment.status) {
          await prisma.payment.update({
            where: { id: latestPayment.id },
            data: { 
              status: newStatus, 
              paidAt: newStatus === "paid" ? new Date() : null 
            }
          });

          await prisma.purchase.update({
            where: { id: purchase.id },
            data: { 
              status: newStatus,
              paidAt: newStatus === "paid" ? new Date() : null
            }
          });

          return NextResponse.json({ status: newStatus });
        }
      } catch (err) {
        console.error("[Payment Status Sync Error]", err);
        // Fallback to internal status if Cora API fails
      }
    }

    return NextResponse.json({ status: purchase.status });

  } catch (error) {
    console.error("[Payment Status Error]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
