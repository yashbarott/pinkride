import Link from "next/link";
import { notFound } from "next/navigation";

const policyTitles: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  cancellation: "Ride Cancellation Policy",
  refunds: "Refund Policy",
  "captain-terms": "Captain Terms",
  safety: "Safety Policy",
  "data-retention": "Data Retention Policy",
  cookies: "Cookie Policy",
};

export default async function PolicyDraftPage({ params }: PageProps<"/legal/[policy]">) {
  const { policy } = await params;
  const title = policyTitles[policy];

  if (!title) notFound();

  return (
    <main className="min-h-screen bg-[#fffafc] px-5 py-12 text-[#1d1b1f]">
      <article className="mx-auto max-w-3xl">
        <Link href="/legal" className="text-sm font-semibold text-[#a6437a]">All policies</Link>
        <h1 className="mt-5 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm text-[#706b71]">Draft - pending legal and compliance review</p>
        <div className="mt-8 rounded-md border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <p>This page is a placeholder and does not state PinkRide&apos;s final policy or create contractual terms.</p>
          <p className="mt-3">Before publication, qualified reviewers must define applicable jurisdiction, service operations, data practices, user rights, complaint channels, and effective dates.</p>
        </div>
      </article>
    </main>
  );
}