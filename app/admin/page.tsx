import { getAdminDashboard } from "@/services/adminService";

export default async function AdminDashboardPage() {
  const result = await getAdminDashboard();
  const stats = result.success ? result.data.stats : {};

  return (
    <main className="min-h-screen bg-[#fffafc] px-4 py-10 text-[#1d1b1f]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a7d85]">PinkRide</p>
          <h1 className="mt-2 text-4xl font-bold tracking-[-0.06em]">Admin dashboard</h1>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total passengers", stats.totalPassengers ?? 0],
            ["Total captains", stats.totalCaptains ?? 0],
            ["Active rides", stats.activeRides ?? 0],
            ["Revenue", `₹${stats.revenue ?? 0}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-[#f0dfe7] bg-white p-5 shadow-[0_16px_32px_rgba(132,92,120,0.07)]">
              <p className="text-sm text-[#706b71]">{label}</p>
              <p className="mt-4 text-3xl font-bold tracking-[-0.06em]">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["Online captains", stats.onlineCaptains ?? 0],
            ["Pending verification", stats.pendingVerification ?? 0],
            ["Completed rides", stats.completedRides ?? 0],
            ["Safety alerts", stats.safetyAlerts ?? 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-[#f0dfe7] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6d6971]">{label}</span>
                <span className="rounded-full bg-[#fff3f8] px-2 py-1 text-xs font-medium text-[#a6437a]">Live</span>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-[-0.05em]">{value}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
