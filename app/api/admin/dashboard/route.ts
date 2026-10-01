import { NextResponse } from "next/server";

import { getDemoModeUnavailableResponse } from "@/lib/demo-api";
import { getAdminDashboard } from "@/services/adminService";

export async function GET() {
  const unavailable = getDemoModeUnavailableResponse();
  if (unavailable) return unavailable;

  const result = await getAdminDashboard();

  return NextResponse.json(result, {
    status: 200,
  });
}
