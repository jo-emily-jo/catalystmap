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
    <tr
      id={`rel-${relationship.id}`}
      className="border-t border-[--border] transition-colors hover:bg-[--background-secondary]"
    >
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
        <ScoreBadge
          score={relationship.relevanceScore}
          breakdown={relationship.scoreBreakdown}
        />
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

export function RelatedCompanyCard({
  relationship,
}: {
  relationship: Relationship;
}) {
  const rc = relationship.relatedCompany;
  const latestSource = relationship.sources[0];

  return (
    <div
      id={`rel-${relationship.id}`}
      className="rounded border border-[--border] bg-[--background] p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-medium text-[--foreground]">
            {rc.name}
          </span>
          <span className="ml-2 font-mono text-xs text-[--foreground-secondary]">
            {rc.ticker}
          </span>
        </div>
        <ScoreBadge
          score={relationship.relevanceScore}
          breakdown={relationship.scoreBreakdown}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <RelationshipTag type={relationship.relationshipType} />
        <span className="text-xs capitalize text-[--foreground-secondary]">
          {relationship.relationshipStrength}
        </span>
        <HypeRiskIndicator level={relationship.hypeRisk} />
      </div>
      {latestSource && (
        <a
          href={latestSource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-accent hover:underline"
        >
          Source
        </a>
      )}
    </div>
  );
}
