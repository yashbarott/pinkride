import { NextResponse } from "next/server";

const databaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

export function GET() {
  const status = databaseConfigured ? "unknown" : "not_configured";

  return NextResponse.json(
    {
      status: "degraded",
      database: status,
      realtime: "not_configured",
      timestamp: new Date().toISOString(),
    },
    { status: 503 },
  );
}