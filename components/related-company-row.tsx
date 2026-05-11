import type { Relationship } from "@/lib/types";
import { RelationshipTag } from "./relationship-tag";
import { ScoreBadge } from "./score-badge";
import { HypeRiskIndicator } from "./hype-risk-indicator";

export function RelatedCompanyRow({
  relationship,
}: {
  relationship: Relationship;
}) {
  const rc = relationship.relatedCompany;
  const latestSource = relationship.sources[0];

  return (
    <tr className="border-t border-[--border] transition-colors hover:bg-[--background-secondary]">
      <td className="px-3 py-3 text-sm font-medium text-[--foreground]">
        {rc.name}
      </td>
      <td className="px-3 py-3 font-mono text-sm text-[--foreground]">
        {rc.ticker}
      </td>
      <td className="px-3 py-3 text-xs text-[--foreground-secondary]">
        {rc.exchange}
      </td>
      <td className="px-3 py-3">
        <RelationshipTag type={relationship.relationshipType} />
      </td>
      <td className="px-3 py-3 text-xs capitalize text-[--foreground-secondary]">
        {relationship.relationshipStrength}
      </td>
      <td className="px-3 py-3">
        <ScoreBadge score={relationship.relevanceScore} />
      </td>
      <td className="px-3 py-3">
        <HypeRiskIndicator level={relationship.hypeRisk} />
      </td>
      <td className="px-3 py-3 text-xs">
        {latestSource ? (
          <a
            href={latestSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
            title={latestSource.title ?? latestSource.url}
          >
            Source
          </a>
        ) : (
          <span className="text-[--foreground-secondary]">-</span>
        )}
      </td>
    </tr>
  );
}
