import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { updateRideStatus } from "@/services/rideService";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const { id } = await context.params;
  const result = await updateRideStatus(id, "captain_assigned");

  return NextResponse.json(result, {
    status: result.success ? 200 : 400,
  });
}
