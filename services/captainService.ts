import { createErrorResponse, createSuccessResponse } from "@/lib/config";
import type { ApiResponse, CaptainProfile } from "@/types";

const captainProfiles: CaptainProfile[] = [
  {
    id: "captain_ananya",
    userId: "user_captain_ananya",
    verificationStatus: "approved",
    rating: 4.9,
    totalRides: 1248,
    completedRides: 1241,
    cancelledRides: 7,
    availabilityStatus: "online",
    onlineStatus: true,
    currentLatitude: 21.1702,
    currentLongitude: 72.8311,
    lastLocationUpdate: new Date().toISOString(),
    city: "Surat, Gujarat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function setCaptainAvailability(captainId: string, online: boolean): Promise<ApiResponse<{ captain: CaptainProfile }>> {
  const captain = captainProfiles.find((entry) => entry.id === captainId);

  if (!captain) {
    return createErrorResponse("CAPTAIN_NOT_FOUND", "Captain profile not found.");
  }

  captain.onlineStatus = online;
  captain.availabilityStatus = online ? "online" : "offline";
  captain.updatedAt = new Date().toISOString();

  return createSuccessResponse({ captain });
}

export async function updateCaptainLocation(captainId: string, latitude: number, longitude: number): Promise<ApiResponse<{ captain: CaptainProfile }>> {
  const captain = captainProfiles.find((entry) => entry.id === captainId);

  if (!captain) {
    return createErrorResponse("CAPTAIN_NOT_FOUND", "Captain profile not found.");
  }

  captain.currentLatitude = latitude;
  captain.currentLongitude = longitude;
  captain.lastLocationUpdate = new Date().toISOString();
  captain.updatedAt = new Date().toISOString();

  return createSuccessResponse({ captain });
}
