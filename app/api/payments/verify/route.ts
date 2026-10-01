import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { verifyPayment } from "@/services/paymentService";

export async function POST(request: Request) {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => ({}));
  const result = await verifyPayment(String(body.orderId ?? "order_demo"), String(body.paymentId ?? "payment_demo"));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
