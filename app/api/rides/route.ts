import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { createRide } from "@/services/rideService";

export async function POST(request: Request) {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const body = await request.json().catch(() => ({}));
  const result = await createRide(String(body.passengerId ?? "user_passenger_priya"), body);

  return NextResponse.json(result, {
    status: result.success ? 201 : 400,
  });
}

export async function GET() {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  return NextResponse.json({
    success: true,
    data: {
      rides: [],
      message: "Ride listing is served via the backend abstraction in demo mode.",
    },
  });
}
