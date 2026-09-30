import { evaluateCaptainEligibility } from "@/lib/eligibility";
import type { CaptainProfile, Ride, RideRequest } from "@/types";

const demoCaptains: CaptainProfile[] = [
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
  {
    id: "captain_kavya",
    userId: "user_captain_kavya",
    verificationStatus: "approved",
    rating: 4.8,
    totalRides: 980,
    completedRides: 972,
    cancelledRides: 8,
    availabilityStatus: "online",
    onlineStatus: true,
    currentLatitude: 21.155,
    currentLongitude: 72.84,
    lastLocationUpdate: new Date().toISOString(),
    city: "Surat, Gujarat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function findAvailableCaptain() {
  const eligibleCaptain = demoCaptains.find((captain) => {
    const eligibility = evaluateCaptainEligibility(captain);
    return eligibility.eligible && captain.availabilityStatus !== "busy";
  });

  return eligibleCaptain ?? demoCaptains[0];
}

export function createRideRequestForCaptain(ride: Ride, captainId: string): RideRequest {
  const now = new Date();

  return {
    id: `ride_request_${ride.id}`,
    rideId: ride.id,
    captainId,
    status: "pending",
    sentAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 15000).toISOString(),
  };
}

export function getNearbyCaptains() {
  return demoCaptains.map((captain) => ({
    captain,
    distanceKm: 1.2,
    etaMinutes: 4,
  }));
}
