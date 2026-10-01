import { NextResponse } from "next/server";

import { config, createErrorResponse } from "@/lib/config";

export function getDemoModeUnavailableResponse() {
  if (config.demoMode) {
    return null;
  }

  return NextResponse.json(
    createErrorResponse("SERVICE_UNAVAILABLE", "This service is not configured for production."),
    { status: 503 },
  );
}