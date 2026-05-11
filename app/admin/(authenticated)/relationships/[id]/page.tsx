import { notFound } from "next/navigation";
import { getRelationshipById } from "@/lib/db/relationships";
import { RelationshipForm } from "@/components/admin/relationship-form";
import { SourceForm } from "@/components/admin/source-form";
import { SourceList } from "./source-list";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function EditRelationshipPage({ params }: PageProps) {
  const relationship = await getRelationshipById(params.id);
  if (!relationship) notFound();

  return (
    <div>
      <h1 className="text-xl font-medium text-[--foreground]">
        Edit relationship: {relationship.relatedCompany.ticker} —{" "}
        {relationship.relationshipType}
      </h1>

      <div className="mt-6">
        <RelationshipForm relationship={relationship} />
      </div>

      <div className="mt-10">
        <h2 className="text-base font-medium text-[--foreground]">
          Sources ({relationship.sources.length})
        </h2>
        <div className="mt-3">
          <SourceList
            sources={relationship.sources}
            relationshipId={relationship.id}
          />
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-[--foreground-secondary]">
            Add source
          </h3>
          <SourceForm relationshipId={relationship.id} />
        </div>
      </div>
    </div>
  );
}
