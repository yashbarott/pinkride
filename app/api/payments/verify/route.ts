import { NextResponse } from "next/server";

import { verifyPayment } from "@/services/paymentService";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await verifyPayment(String(body.orderId ?? "order_demo"), String(body.paymentId ?? "payment_demo"));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
