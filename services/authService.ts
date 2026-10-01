import { config, createErrorResponse, createSuccessResponse, getDemoSessionToken } from "@/lib/config";
import type { ApiResponse, SessionInfo, User, UserRole } from "@/types";

const demoUsers: User[] = [
  {
    id: "user_passenger_priya",
    role: "passenger",
    phone: "9876543210",
    email: "priya.sharma@gmail.com",
    name: "Priya Sharma",
    gender: "female",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user_captain_ananya",
    role: "captain",
    phone: "9876543210",
    email: "ananya.patel@pinkride.app",
    name: "Ananya Patel",
    gender: "female",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "user_admin_dev",
    role: "admin",
    phone: "9999999999",
    email: "admin@pinkride.app",
    name: "PinkRide Admin",
    gender: "female",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function requestOtp(phone: string): Promise<ApiResponse<{ otpSent: boolean; otp?: string }>> {
  const cleaned = (phone ?? "").replace(/\D/g, "");

  if (!/^\d{10}$/.test(cleaned)) {
    return createErrorResponse("INVALID_PHONE", "Phone number must be 10 digits.");
  }

  const user = demoUsers.find((entry) => entry.phone === cleaned) ?? demoUsers[0];

  if (config.demoMode) {
    return createSuccessResponse({
      otpSent: true,
      otp: config.defaultOtp,
      userId: user.id,
    });
  }

  return createSuccessResponse({ otpSent: true });
}

export async function verifyOtp(phone: string, code: string): Promise<ApiResponse<{ session: SessionInfo; user: User }>> {
  const cleaned = (phone ?? "").replace(/\D/g, "");

  if (!/^\d{10}$/.test(cleaned)) {
    return createErrorResponse("INVALID_PHONE", "Phone number must be 10 digits.");
  }

  if (code !== config.defaultOtp && config.demoMode) {
    return createErrorResponse("INVALID_OTP", "Invalid OTP. Use the demo code 4821.");
  }

  const user = demoUsers.find((entry) => entry.phone === cleaned) ?? demoUsers[0];
  const token = getDemoSessionToken(user.id);

  const session: SessionInfo = {
    userId: user.id,
    role: user.role,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };

  return createSuccessResponse({ session, user });
}

export async function getDemoUsers(): Promise<User[]> {
  return demoUsers;
}

export function getDefaultRoleByPhone(phone: string): UserRole {
  const cleaned = (phone ?? "").replace(/\D/g, "");
  const user = demoUsers.find((entry) => entry.phone === cleaned);
  return user?.role ?? "passenger";
}
