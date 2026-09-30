import { createSuccessResponse } from "@/lib/config";
import type { ApiResponse } from "@/types";

export async function getAdminDashboard(): Promise<ApiResponse<{ stats: Record<string, number> }>> {
  return createSuccessResponse({
    stats: {
      totalPassengers: 1280,
      totalCaptains: 240,
      onlineCaptains: 84,
      activeRides: 19,
      completedRides: 3452,
      cancelledRides: 71,
      revenue: 84620,
      pendingVerification: 12,
      openSupportTickets: 5,
      safetyAlerts: 2,
    },
  });
}
