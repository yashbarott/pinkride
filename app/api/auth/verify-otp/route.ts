import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { verifyOtp } from "@/services/authService";

export async function POST(request: Request) {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => ({}));
  const result = await verifyOtp(String(body.phone ?? ""), String(body.code ?? ""));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
