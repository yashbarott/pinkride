import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { requestOtp } from "@/services/authService";

export async function POST(request: Request) {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => ({}));
  const result = await requestOtp(String(body.phone ?? ""));

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
