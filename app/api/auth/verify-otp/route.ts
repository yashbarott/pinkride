import { NextResponse } from "next/server";

import { verifyOtp } from "@/services/authService";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await verifyOtp(String(body.phone ?? ""), String(body.code ?? ""));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
