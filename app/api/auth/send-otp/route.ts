import { NextResponse } from "next/server";

import { requestOtp } from "@/services/authService";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await requestOtp(String(body.phone ?? ""));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
