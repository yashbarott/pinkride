export function calculateFare(distanceKm = 6.4, durationMinutes = 18) {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new RangeError("Distance must be a finite, non-negative number.");
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes < 0) {
    throw new RangeError("Duration must be a finite, non-negative number.");
  }

  const baseFare = 30;
  const distanceCharge = distanceKm * 6.5;
  const timeCharge = durationMinutes * 1.2;
  const platformFee = 6;
  const total = baseFare + distanceCharge + timeCharge + platformFee;

  return {
    estimatedFare: Number(total.toFixed(2)),
    captainEarnings: Number((total * 0.88).toFixed(2)),
    distanceKm,
    durationMinutes,
  };
}