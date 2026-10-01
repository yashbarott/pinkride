import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { createPaymentOrder } from "@/services/paymentService";

export async function POST(request: Request) {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => ({}));
  const result = await createPaymentOrder(Number(body.amount ?? 82));

  return NextResponse.json(result, {
    status: result.success ? 201 : 400,
  });
}
