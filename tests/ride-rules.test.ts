import { describe, expect, it } from "vitest";

import { canTransitionRide } from "@/lib/ride-rules";

describe("ride state transitions", () => {
  it.each([
    ["searching_captain", "captain_assigned"],
    ["captain_assigned", "captain_navigating_pickup"],
    ["captain_navigating_pickup", "captain_arrived"],
    ["captain_arrived", "awaiting_pin"],
    ["awaiting_pin", "ride_started"],
    ["ride_started", "ride_in_progress"],
    ["ride_in_progress", "ride_completed"],
    ["ride_completed", "payment_pending"],
    ["payment_pending", "payment_completed"],
    ["payment_completed", "rated"],
  ] as const)("allows %s -> %s", (current, next) => {
    expect(canTransitionRide(current, next)).toBe(true);
  });

  it.each([
    ["ride_completed", "ride_started"],
    ["ride_completed", "rated"],
    ["payment_pending", "rated"],
    ["ride_started", "ride_completed"],
    ["captain_assigned", "captain_arrived"],
    ["rated", "ride_started"],
    ["cancelled", "captain_assigned"],
  ] as const)("rejects %s -> %s", (current, next) => {
    expect(canTransitionRide(current, next)).toBe(false);
  });
});