import { createSuccessResponse } from "@/lib/config";
import type { ApiResponse, SafetyEvent } from "@/types";

export async function triggerSos(rideId?: string, userId = "user_passenger_priya"): Promise<ApiResponse<{ event: SafetyEvent }>> {
  const event: SafetyEvent = {
    id: `safety_${Date.now()}`,
    userId,
    rideId,
    type: "sos",
    location: "Surat, Gujarat",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  return createSuccessResponse({ event });
}

export async function shareRideDetails(rideId: string): Promise<ApiResponse<{ shareToken: string }>> {
  return createSuccessResponse({ shareToken: `share_${rideId}_${Date.now()}` });
}
