import { isDemoMode } from "@/lib/runtime-mode";

const deploymentEnvironment = process.env.APP_ENV ?? process.env.NODE_ENV ?? "development";
const configuredMode = process.env.PINKRIDE_MODE ?? (deploymentEnvironment === "development" ? "demo" : "production");

export const config = {
  appName: "PinkRide",
  demoMode: isDemoMode(deploymentEnvironment, configuredMode),
  authMode: process.env.AUTH_MODE ?? "demo",
  mapsProvider: process.env.MAPS_PROVIDER ?? "demo",
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "demo",
  environment: deploymentEnvironment,
  defaultOtp: "4821",
  defaultPhone: "9876543210",
};

export const featureFlags = {
  razorpay: process.env.ENABLE_RAZORPAY === "true",
  cash: process.env.ENABLE_CASH === "true",
  scheduledRides: process.env.ENABLE_SCHEDULED_RIDES === "true",
  surge: process.env.ENABLE_SURGE === "true",
  wallet: process.env.ENABLE_WALLET === "true",
  promoCodes: process.env.ENABLE_PROMO_CODES === "true",
  aiAssistant: process.env.ENABLE_AI_ASSISTANT === "true",
  intercity: process.env.ENABLE_INTERCITY === "true",
  corporateRides: process.env.ENABLE_CORPORATE_RIDES === "true",
} as const;

export function createSuccessResponse<T>(data: T) {
  return {
    success: true,
    data,
  } as const;
}

export function createErrorResponse(code: string, message: string, details?: Record<string, unknown>) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  } as const;
}

export function getDemoSessionToken(userId: string) {
  return `demo_session_${userId}_${Date.now()}`;
}
