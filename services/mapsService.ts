import { createSuccessResponse } from "@/lib/config";
import type { ApiResponse, RoutePlan } from "@/types";

export async function getMapRoute(origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }): Promise<ApiResponse<RoutePlan>> {
  return createSuccessResponse({
    distanceKm: 6.4,
    durationMinutes: 18,
    polyline: ["21.1702,72.8311", "21.1500,72.8000", "21.1400,72.7700"],
    steps: [
      { instruction: "Head toward Vesu", distanceKm: 1.2, durationMinutes: 3 },
      { instruction: "Drive along the city route", distanceKm: 3.4, durationMinutes: 8 },
      { instruction: "Approach your destination", distanceKm: 1.8, durationMinutes: 7 },
    ],
  });
}
