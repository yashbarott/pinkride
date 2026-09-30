export const config = {
  appName: "PinkRide",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE !== "false",
  authMode: process.env.AUTH_MODE ?? "demo",
  mapsProvider: process.env.MAPS_PROVIDER ?? "demo",
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "demo",
  environment: process.env.NODE_ENV ?? "development",
  defaultOtp: "4821",
  defaultPhone: "9876543210",
};

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
