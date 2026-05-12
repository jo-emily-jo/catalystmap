"use client";

import { useState, useId } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ResearchResults } from "@/components/admin/research-results";
import {
  runResearchAction,
  type ResearchCandidate,
  type ResearchResult,
} from "@/app/admin/actions/research-actions";
import { createRelationshipAction } from "@/app/admin/actions/relationship-actions";
import { createRelatedCompanyAction } from "@/app/admin/actions/related-company-actions";
import type { CatalystCompany } from "@/lib/types";
import { sourceTypeToQuality } from "@/lib/scoring/source-quality-score";
import type { SourceType } from "@/lib/types";

interface ResearchClientProps {
  catalysts: CatalystCompany[];
}

export function ResearchClient({ catalysts }: ResearchClientProps) {
  const sessionId = useId();
  const [selectedSlug, setSelectedSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const selectedCatalyst = catalysts.find((c) => c.slug === selectedSlug);

  async function handleResearch() {
    if (!selectedCatalyst) return;
    setLoading(true);
    setResult(null);

    const res = await runResearchAction(
      {
        name: selectedCatalyst.name,
        slug: selectedCatalyst.slug,
        themes: selectedCatalyst.themes.map((t) => t.name).join(", "),
        country: selectedCatalyst.country,
        isPublic: selectedCatalyst.isPublic,
        shortDescription: selectedCatalyst.shortDescription,
        thesisMd: selectedCatalyst.thesisMd,
      },
      sessionId
    );

    setResult(res);
    setLoading(false);
  }

  async function handleApprove(candidate: ResearchCandidate) {
    if (!selectedCatalyst) return;

    // 1. Create or find the related company
    const rcFormData = new FormData();
    rcFormData.set("ticker", candidate.ticker);
    rcFormData.set("exchange", candidate.exchange);
    rcFormData.set("name", candidate.companyName);
    rcFormData.set("country", candidate.country ?? "");
    rcFormData.set("sector", candidate.sector ?? "");

    const rcResult = await createRelatedCompanyAction(
      { success: false },
      rcFormData
    );

    if (!rcResult.success || !rcResult.companyId) {
      throw new Error(rcResult.error ?? "Failed to create related company");
    }

    // 2. Create the relationship with sources
    const sources = candidate.sources.map((s) => ({
      url:
        s.url === "url-not-verified"
          ? "https://url-not-verified.example"
          : s.url,
      title: s.title,
      sourceType: s.sourceType,
      accessedAt: new Date().toISOString(),
    }));

    const relFormData = new FormData();
    relFormData.set("catalystId", selectedCatalyst.id);
    relFormData.set("relatedCompanyId", rcResult.companyId);
    relFormData.set("relationshipType", candidate.relationshipType);
    relFormData.set("relationshipStrength", candidate.relationshipStrength);
    relFormData.set("summary", candidate.evidenceSummary);
    relFormData.set("lastVerifiedAt", new Date().toISOString().split("T")[0]);
    relFormData.set("hypeRisk", candidate.hypeRisk);
    if (candidate.contractValueUsd != null) {
      relFormData.set("contractValueUsd", String(candidate.contractValueUsd));
    }
    if (candidate.isGovernmentProcurement) {
      relFormData.set("isGovernmentProcurement", "true");
    }
    relFormData.set("aiAssisted", "true");
    relFormData.set("sources", JSON.stringify(sources));

    const relResult = await createRelationshipAction(
      { success: false },
      relFormData
    );

    if (!relResult.success) {
      throw new Error(relResult.error ?? "Failed to create relationship");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-[--foreground-secondary]">
            Catalyst
          </label>
          <Select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
          >
            <option value="">Select a catalyst...</option>
            {catalysts.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleResearch} disabled={!selectedSlug || loading}>
          {loading ? "Researching..." : "Run research"}
        </Button>
      </div>

      {result?.error && <p className="text-sm text-red-600">{result.error}</p>}

      {result && !result.error && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-[--foreground-secondary]">
              {result.candidates.length} candidates found
            </p>
            <p className="text-xs text-[--foreground-secondary]">
              {result.remaining} research calls remaining this hour
            </p>
          </div>
          {result.note && (
            <p className="mb-3 text-sm text-amber-600">{result.note}</p>
          )}
          {selectedCatalyst && (
            <ResearchResults
              candidates={result.candidates}
              catalystId={selectedCatalyst.id}
              onApprove={handleApprove}
            />
          )}
        </div>
      )}
    </div>
  );
}
