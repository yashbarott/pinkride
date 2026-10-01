import Link from "next/link";

const policies = [
  ["privacy", "Privacy Policy"],
  ["terms", "Terms of Service"],
  ["cancellation", "Ride Cancellation Policy"],
  ["refunds", "Refund Policy"],
  ["captain-terms", "Captain Terms"],
  ["safety", "Safety Policy"],
  ["data-retention", "Data Retention Policy"],
  ["cookies", "Cookie Policy"],
] as const;

export default function LegalIndexPage() {
  return (
    <main className="min-h-screen bg-[#fffafc] px-5 py-12 text-[#1d1b1f]">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[#a6437a]">PinkRide</Link>
        <h1 className="mt-5 text-3xl font-bold">Policies</h1>
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          Draft placeholders only. These policies are not effective terms and require qualified legal and compliance review before publication or pilot use.
        </p>
        <ul className="mt-8 divide-y divide-[#f0dfe7] border-y border-[#f0dfe7]">
          {policies.map(([slug, title]) => (
            <li key={slug}>
              <Link href={`/legal/${slug}`} className="block py-4 font-medium text-[#713454] underline-offset-4 hover:underline">
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}