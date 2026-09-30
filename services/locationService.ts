import { createErrorResponse, createSuccessResponse } from "@/lib/config";
import type { ApiResponse, RoutePlan } from "@/types";

export async function getRoutePlan(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<ApiResponse<RoutePlan>> {
  if (!origin || !destination) {
    return createErrorResponse("INVALID_ROUTE", "Origin and destination are required.");
  }

  const distanceKm = 6.4;
  const durationMinutes = 18;

  return createSuccessResponse({
    distanceKm,
    durationMinutes,
    polyline: ["21.1702,72.8311", "21.1400,72.7700"],
    steps: [
      { instruction: "Head towards Vesu", distanceKm: 1.2, durationMinutes: 3 },
      { instruction: "Continue along the city route", distanceKm: 3.2, durationMinutes: 8 },
      { instruction: "Approaching destination", distanceKm: 2.0, durationMinutes: 7 },
    ],
  });
}
