import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalystBySlug } from "@/lib/db/catalysts";
import { listRelationshipsByCatalyst } from "@/lib/db/relationships";
import { CatalystHeader } from "@/components/catalyst-header";
import { NetworkGraph } from "@/components/network-graph";
import { RelatedCompanyTable } from "@/components/related-company-table";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const catalyst = await getCatalystBySlug(params.slug);
  if (!catalyst) return { title: "Not found — CatalystMap" };

  return {
    title: `${catalyst.name} — CatalystMap`,
    description: catalyst.shortDescription,
  };
}

export default async function CatalystPage({ params }: PageProps) {
  const catalyst = await getCatalystBySlug(params.slug);
  if (!catalyst) notFound();

  const relationships = await listRelationshipsByCatalyst(catalyst.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-[--foreground-secondary] hover:text-[--foreground]"
      >
        &larr; All themes
      </Link>

      <CatalystHeader catalyst={catalyst} />

      {relationships.length > 0 && (
        <div className="mt-8">
          <NetworkGraph
            catalystName={catalyst.name}
            relationships={relationships}
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-base font-medium text-[--foreground]">
          Public-market counterparties
        </h2>
        <p className="mb-4 mt-1 text-xs text-[--foreground-secondary]">
          Suppliers, contractors, infrastructure providers, and value-chain
          beneficiaries with verifiable relationships.
        </p>
        {relationships.length > 0 ? (
          <RelatedCompanyTable relationships={relationships} />
        ) : (
          <EmptyState companyName={catalyst.name} />
        )}
      </div>
    </div>
  );
}
