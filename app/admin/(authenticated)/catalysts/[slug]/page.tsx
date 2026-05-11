import { notFound } from "next/navigation";
import Link from "next/link";
import { getCatalystBySlug } from "@/lib/db/catalysts";
import { listRelationshipsByCatalyst } from "@/lib/db/relationships";
import { listThemes } from "@/lib/db/themes";
import { CatalystForm } from "@/components/admin/catalyst-form";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/score-badge";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export default async function EditCatalystPage({ params }: PageProps) {
  const [catalyst, themes] = await Promise.all([
    getCatalystBySlug(params.slug),
    listThemes(),
  ]);

  if (!catalyst) notFound();

  const relationships = await listRelationshipsByCatalyst(catalyst.id);

  return (
    <div>
      <h1 className="text-xl font-medium text-[--foreground]">
        Edit: {catalyst.name}
      </h1>

      <div className="mt-6">
        <CatalystForm catalyst={catalyst} themes={themes} />
      </div>

      <div className="mt-10">
        <h2 className="text-base font-medium text-[--foreground]">
          Relationships ({relationships.length})
        </h2>
        <div className="mt-3 space-y-2">
          {relationships.map((r) => (
            <Link
              key={r.id}
              href={`/admin/relationships/${r.id}`}
              className="flex items-center justify-between rounded border border-[--border] bg-[--background] p-3 hover:border-[--border-emphasis]"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {r.relatedCompany.ticker}
                </span>
                <span className="text-sm text-[--foreground-secondary]">
                  {r.relatedCompany.name}
                </span>
                <Badge>{r.relationshipType}</Badge>
                {r.aiAssisted && <Badge variant="accent">AI</Badge>}
              </div>
              <ScoreBadge
                score={r.relevanceScore}
                breakdown={r.scoreBreakdown}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
