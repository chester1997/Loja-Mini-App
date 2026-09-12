import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Note: In a real production scenario, you MUST validate the signature of the webhook sent by Cora
    const body = await req.json();

    // Log the webhook reception safely (no sensitive data)
    console.log(`[Cora Webhook] Received event type: ${body.event_type} for invoice: ${body.data?.id}`);

    // We only care about Invoice events for now
    if (body.event_type?.startsWith("invoice.")) {
      const coraInvoiceId = body.data?.id;
      const coraStatus = body.data?.status; // e.g., PAID

      if (!coraInvoiceId) {
        return NextResponse.json({ received: true });
      }

      const payment = await prisma.payment.findFirst({
        where: { providerPaymentId: coraInvoiceId }
      });

      if (!payment) {
        console.log(`[Cora Webhook] Payment not found for invoice: ${coraInvoiceId}`);
        return NextResponse.json({ received: true });
      }

      // Idempotency: if already paid, do nothing
      if (payment.status === "paid") {
        return NextResponse.json({ received: true });
      }

      let newStatus = payment.status;
      if (coraStatus === "PAID") newStatus = "paid";
      else if (coraStatus === "LATE") newStatus = "expired";
      else if (coraStatus === "CANCELLED") newStatus = "cancelled";

      if (newStatus !== payment.status) {
        console.log(`[Cora Webhook] Updating payment ${payment.id} status to ${newStatus}`);
        
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: newStatus,
            paidAt: newStatus === "paid" ? new Date() : null
          }
        });

        // Update the purchase status to release content
        await prisma.purchase.update({
          where: { id: payment.purchaseId },
          data: {
            status: newStatus,
            paidAt: newStatus === "paid" ? new Date() : null
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Cora Webhook Error]", error);
    // Respond quickly to Cora even on internal error to avoid retries loops if it's our fault, 
    // but 500 will make Cora retry depending on their retry policy. 
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
