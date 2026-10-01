import { describe, expect, it } from "vitest";

import { calculateFare } from "@/lib/fare";

describe("calculateFare", () => {
  it("calculates the configured base, distance, time, and platform charges", () => {
    expect(calculateFare(10, 10)).toEqual({
      estimatedFare: 113,
      captainEarnings: 99.44,
      distanceKm: 10,
      durationMinutes: 10,
    });
  });

  it("uses the demo route estimate when no route values are supplied", () => {
    expect(calculateFare()).toEqual({
      estimatedFare: 99.2,
      captainEarnings: 87.3,
      distanceKm: 6.4,
      durationMinutes: 18,
    });
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("rejects invalid distance %s", (distance) => {
    expect(() => calculateFare(distance, 1)).toThrow(RangeError);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("rejects invalid duration %s", (duration) => {
    expect(() => calculateFare(1, duration)).toThrow(RangeError);
  });
});