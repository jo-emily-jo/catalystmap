"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ResearchCandidate } from "@/app/admin/actions/research-actions";

interface ResearchResultsProps {
  candidates: ResearchCandidate[];
  catalystId: string;
  onApprove: (candidate: ResearchCandidate) => Promise<void>;
}

export function ResearchResults({
  candidates,
  catalystId,
  onApprove,
}: ResearchResultsProps) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [approving, setApproving] = useState<number | null>(null);
  const [approved, setApproved] = useState<Set<number>>(new Set());

  async function handleApprove(candidate: ResearchCandidate, index: number) {
    setApproving(index);
    try {
      await onApprove(candidate);
      setApproved((prev) => new Set(prev).add(index));
    } catch {
      // Error handling in parent
    }
    setApproving(null);
  }

  return (
    <div className="space-y-4">
      {candidates.map((c, i) => {
        if (dismissed.has(i)) return null;
        const isApproved = approved.has(i);

        return (
          <div
            key={`${c.ticker}-${i}`}
            className={`rounded border border-[--border] p-4 ${isApproved ? "opacity-50" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[--foreground]">
                    {c.companyName}
                  </span>
                  <span className="font-mono text-sm text-[--foreground-secondary]">
                    {c.ticker}
                  </span>
                  <span className="text-xs text-[--foreground-secondary]">
                    {c.exchange}
                  </span>
                </div>
                <div className="mt-1 flex gap-2">
                  <Badge>{c.relationshipType}</Badge>
                  <Badge
                    variant={
                      c.relationshipStrength === "direct"
                        ? "success"
                        : "default"
                    }
                  >
                    {c.relationshipStrength}
                  </Badge>
                  <Badge
                    variant={
                      c.hypeRisk === "high"
                        ? "destructive"
                        : c.hypeRisk === "medium"
                          ? "warning"
                          : "default"
                    }
                  >
                    {c.hypeRisk} risk
                  </Badge>
                </div>
              </div>
            </div>

            <p className="mt-2 text-sm text-[--foreground-secondary]">
              {c.evidenceSummary}
            </p>

            <div className="mt-2 space-y-1">
              {c.sources.map((s, si) => (
                <div key={si} className="text-xs text-[--foreground-secondary]">
                  <span className="rounded bg-[--background-secondary] px-1 py-0.5">
                    {s.sourceType.replace(/_/g, " ")}
                  </span>{" "}
                  {s.url === "url-not-verified" ? (
                    <span className="text-amber-600">URL not verified</span>
                  ) : (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {s.title || s.url}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {!isApproved && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(c, i)}
                  disabled={approving === i}
                >
                  {approving === i ? "Saving..." : "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDismissed((prev) => new Set(prev).add(i))}
                >
                  Discard
                </Button>
              </div>
            )}
            {isApproved && (
              <p className="mt-2 text-xs text-green-600">Approved and saved</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
