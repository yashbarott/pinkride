import { NextResponse } from "next/server";

import { getAdminDashboard } from "@/services/adminService";

export async function GET() {
  const result = await getAdminDashboard();

  return NextResponse.json(result, {
    status: 200,
  });
}
