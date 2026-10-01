import { createErrorResponse, createSuccessResponse } from "@/lib/config";
import { evaluatePassengerEligibility } from "@/lib/eligibility";
import { calculateFare } from "@/lib/fare";
import { canTransitionRide } from "@/lib/ride-rules";
import { findAvailableCaptain } from "@/services/matchingService";
import type { ApiResponse, Ride, RideStatus } from "@/types";

const rides: Ride[] = [];

const DEFAULT_ROUTE = {
  pickupLat: 21.1702,
  pickupLng: 72.8311,
  pickupAddress: "Current Location",
  destinationLat: 21.1400,
  destinationLng: 72.7700,
  destinationAddress: "Vesu, Surat",
};

export { calculateFare } from "@/lib/fare";

export async function createRide(passengerId: string, override?: Partial<Ride>): Promise<ApiResponse<{ ride: Ride; captainId: string }>> {
  const passengerEligibility = evaluatePassengerEligibility({ role: "passenger", status: "active" });

  if (!passengerEligibility.eligible) {
    return createErrorResponse("PASSENGER_INELIGIBLE", passengerEligibility.reason ?? "Passenger is not eligible.");
  }

  const fare = calculateFare();
  const captain = findAvailableCaptain();

  const ride: Ride = {
    id: `ride_${Date.now()}`,
    passengerId,
    captainId: captain.id,
    pickupLat: override?.pickupLat ?? DEFAULT_ROUTE.pickupLat,
    pickupLng: override?.pickupLng ?? DEFAULT_ROUTE.pickupLng,
    pickupAddress: override?.pickupAddress ?? DEFAULT_ROUTE.pickupAddress,
    destinationLat: override?.destinationLat ?? DEFAULT_ROUTE.destinationLat,
    destinationLng: override?.destinationLng ?? DEFAULT_ROUTE.destinationLng,
    destinationAddress: override?.destinationAddress ?? DEFAULT_ROUTE.destinationAddress,
    distanceKm: fare.distanceKm,
    estimatedDurationMinutes: fare.durationMinutes,
    estimatedFare: fare.estimatedFare,
    finalFare: fare.estimatedFare,
    captainEarnings: fare.captainEarnings,
    status: "searching_captain",
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  rides.push(ride);

  return createSuccessResponse({ ride, captainId: captain.id });
}

export async function updateRideStatus(rideId: string, status: RideStatus): Promise<ApiResponse<{ ride: Ride }>> {
  const ride = rides.find((entry) => entry.id === rideId);

  if (!ride) {
    return createErrorResponse("RIDE_NOT_FOUND", "Ride not found.");
  }

  if (ride.status === status) {
    return createSuccessResponse({ ride });
  }

  if (!canTransitionRide(ride.status, status)) {
    return createErrorResponse("RIDE_INVALID_STATE", `Cannot transition ride from ${ride.status} to ${status}.`);
  }

  ride.status = status;

  if (status === "ride_completed") {
    ride.completedAt = new Date().toISOString();
    ride.paymentStatus = "pending";
  }

  if (status === "cancelled") {
    ride.cancelledAt = new Date().toISOString();
  }

  return createSuccessResponse({ ride });
}

export async function verifyRidePin(rideId: string, pin: string): Promise<ApiResponse<{ valid: boolean; ride: Ride }>> {
  const ride = rides.find((entry) => entry.id === rideId);

  if (!ride) {
    return createErrorResponse("RIDE_NOT_FOUND", "Ride not found.");
  }

  if (ride.status !== "awaiting_pin") {
    return createErrorResponse("RIDE_INVALID_STATE", "Ride is not awaiting a start PIN.");
  }

  const valid = pin === "4821";

  if (valid) {
    ride.status = "ride_started";
    ride.startedAt = new Date().toISOString();
  }

  return createSuccessResponse({ valid, ride });
}

export async function getRide(rideId: string): Promise<ApiResponse<{ ride: Ride | undefined }>> {
  const ride = rides.find((entry) => entry.id === rideId);
  return createSuccessResponse({ ride });
}
