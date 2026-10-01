import { createSuccessResponse } from "@/lib/config";
import type { ApiResponse } from "@/types";

export async function getWalletSummary(): Promise<ApiResponse<{ balance: number; pendingBalance: number; withdrawableBalance: number }>> {
  return createSuccessResponse({
    balance: 4280,
    pendingBalance: 640,
    withdrawableBalance: 4280,
  });
}

export async function requestWithdrawal(amount: number): Promise<ApiResponse<{ requestedAmount: number; status: string }>> {
  return createSuccessResponse({
    requestedAmount: amount,
    status: "requested",
  });
}
