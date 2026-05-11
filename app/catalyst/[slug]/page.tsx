import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCatalystBySlug, getRelationshipsByCatalyst } from "@/lib/db/mock";
import { CatalystHeader } from "@/components/catalyst-header";
import { RelatedCompanyTable } from "@/components/related-company-table";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

interface PageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const catalyst = getCatalystBySlug(params.slug);
  if (!catalyst) return { title: "Not found — CatalystMap" };

  return {
    title: `${catalyst.name} — CatalystMap`,
    description: catalyst.shortDescription,
  };
}

export default function CatalystPage({ params }: PageProps) {
  const catalyst = getCatalystBySlug(params.slug);
  if (!catalyst) notFound();

  const relationships = getRelationshipsByCatalyst(catalyst.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-[--foreground-secondary] hover:text-[--foreground]"
      >
        &larr; All themes
      </Link>

      <CatalystHeader catalyst={catalyst} />

      <div className="mt-8">
        <h2 className="mb-4 text-base font-medium text-[--foreground]">
          Related public companies
        </h2>
        {relationships.length > 0 ? (
          <RelatedCompanyTable relationships={relationships} />
        ) : (
          <EmptyState companyName={catalyst.name} />
        )}
      </div>
    </div>
  );
}
