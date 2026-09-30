import { NextResponse } from "next/server";

import { createPaymentOrder } from "@/services/paymentService";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await createPaymentOrder(Number(body.amount ?? 82));

  return NextResponse.json(result, {
    status: result.success ? 201 : 400,
  });
}
