import { describe, expect, it } from "vitest";

import { createRide, updateRideStatus, verifyRidePin } from "@/services/rideService";
import type { ApiResponse, Ride } from "@/types";

function requireRide(response: ApiResponse<{ ride: Ride }>) {
  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data.ride;
}

describe("ride service demo lifecycle", () => {
  it("ignores client economics, rejects invalid jumps, and safely completes the ride once", async () => {
    const created = await createRide("passenger_demo", {
      distanceKm: 999,
      estimatedDurationMinutes: 999,
      estimatedFare: 1,
      finalFare: 1,
      captainEarnings: 1_000_000,
      status: "ride_completed",
    });

    expect(created.success).toBe(true);
    if (!created.success) return;

    const rideId = created.data.ride.id;
    expect(created.data.ride).toMatchObject({
      distanceKm: 6.4,
      estimatedDurationMinutes: 18,
      estimatedFare: 99.2,
      finalFare: 99.2,
      captainEarnings: 87.3,
      status: "searching_captain",
    });

    const invalidJump = await updateRideStatus(rideId, "ride_completed");
    expect(invalidJump).toMatchObject({ success: false, error: { code: "RIDE_INVALID_STATE" } });

    for (const status of [
      "captain_requested",
      "captain_assigned",
      "captain_navigating_pickup",
      "captain_arrived",
      "awaiting_pin",
    ] as const) {
      requireRide(await updateRideStatus(rideId, status));
    }

    const wrongPin = await verifyRidePin(rideId, "0000");
    expect(wrongPin.success && wrongPin.data.valid).toBe(false);

    const correctPin = await verifyRidePin(rideId, "4821");
    expect(correctPin.success && correctPin.data.valid).toBe(true);

    requireRide(await updateRideStatus(rideId, "ride_in_progress"));
    const completed = requireRide(await updateRideStatus(rideId, "ride_completed"));
    const repeatedCompletion = requireRide(await updateRideStatus(rideId, "ride_completed"));
    expect(repeatedCompletion.completedAt).toBe(completed.completedAt);

    requireRide(await updateRideStatus(rideId, "payment_pending"));
    requireRide(await updateRideStatus(rideId, "payment_completed"));
    requireRide(await updateRideStatus(rideId, "rated"));
  });
});