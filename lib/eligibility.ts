import type { CaptainProfile, User } from "@/types";

export function evaluatePassengerEligibility(user: Pick<User, "role" | "status">) {
  if (user.role !== "passenger") {
    return { eligible: false, verificationStatus: "pending", reason: "Only passenger accounts can book rides." };
  }

  if (user.status !== "active") {
    return { eligible: false, verificationStatus: "pending", reason: "Account is not active." };
  }

  return { eligible: true, verificationStatus: "approved", reason: "Passenger eligible." };
}

export function evaluateCaptainEligibility(captain: CaptainProfile | null | undefined) {
  if (!captain) {
    return { eligible: false, verificationStatus: "pending", reason: "Captain profile not found." };
  }

  if (captain.verificationStatus !== "approved") {
    return {
      eligible: false,
      verificationStatus: captain.verificationStatus,
      reason: "Captain is not yet verified and eligible to accept rides.",
    };
  }

  if (captain.availabilityStatus === "busy") {
    return { eligible: false, verificationStatus: "approved", reason: "Captain is currently busy." };
  }

  return { eligible: true, verificationStatus: "approved", reason: "Captain eligible." };
}
