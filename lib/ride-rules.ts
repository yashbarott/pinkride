import type { RideStatus } from "@/types";

const allowedRideTransitions: Record<RideStatus, RideStatus[]> = {
  idle: ["searching_captain"],
  searching_captain: ["captain_requested", "captain_assigned", "cancelled"],
  captain_requested: ["searching_captain", "captain_assigned", "cancelled"],
  captain_assigned: ["captain_navigating_pickup", "cancelled"],
  captain_navigating_pickup: ["captain_arrived", "cancelled"],
  captain_arrived: ["awaiting_pin", "cancelled"],
  awaiting_pin: ["ride_started", "cancelled"],
  ride_started: ["ride_in_progress", "cancelled"],
  ride_in_progress: ["ride_completed", "cancelled"],
  ride_completed: ["payment_pending"],
  payment_pending: ["payment_completed"],
  payment_completed: ["rated"],
  rated: [],
  cancelled: [],
};

export function canTransitionRide(current: RideStatus, next: RideStatus) {
  return allowedRideTransitions[current].includes(next);
}