"use client";

import { useState, useMemo } from "react";
import type {
  Relationship,
  RelationshipStrength,
  RelationshipType,
} from "@/lib/types";
import { RelatedCompanyRow } from "./related-company-row";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortField = "score" | "type" | "strength" | "hypeRisk" | "ticker" | "name";
type SortDir = "asc" | "desc";

const STRENGTH_OPTIONS: RelationshipStrength[] = [
  "direct",
  "indirect",
  "speculative",
];

const TYPE_OPTIONS: RelationshipType[] = [
  "investment",
  "customer",
  "supplier",
  "partnership",
  "infrastructure",
  "thematic",
  "speculative",
];

function sortValue(r: Relationship, field: SortField): string | number {
  switch (field) {
    case "score":
      return r.relevanceScore;
    case "type":
      return r.relationshipType;
    case "strength":
      return r.relationshipStrength;
    case "hypeRisk":
      return r.hypeRisk;
    case "ticker":
      return r.relatedCompany.ticker;
    case "name":
      return r.relatedCompany.name;
  }
}

export function RelatedCompanyTable({
  relationships,
}: {
  relationships: Relationship[];
}) {
  const [sortField, setSortField] = useState<SortField>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterStrength, setFilterStrength] = useState<
    RelationshipStrength | "all"
  >("all");
  const [filterType, setFilterType] = useState<RelationshipType | "all">("all");

  const filtered = useMemo(() => {
    return relationships.filter((r) => {
      if (filterStrength !== "all" && r.relationshipStrength !== filterStrength)
        return false;
      if (filterType !== "all" && r.relationshipType !== filterType)
        return false;
      return true;
    });
  }, [relationships, filterStrength, filterType]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sortField);
      const bv = sortValue(b, sortField);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "score" ? "desc" : "asc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="inline h-3 w-3" />
    ) : (
      <ChevronDown className="inline h-3 w-3" />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="text-[--foreground-secondary]">
          Strength
          <select
            className="ml-1.5 rounded border border-[--border] bg-[--background] px-2 py-1 text-sm text-[--foreground]"
            value={filterStrength}
            onChange={(e) =>
              setFilterStrength(e.target.value as RelationshipStrength | "all")
            }
          >
            <option value="all">All</option>
            {STRENGTH_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-[--foreground-secondary]">
          Type
          <select
            className="ml-1.5 rounded border border-[--border] bg-[--background] px-2 py-1 text-sm text-[--foreground]"
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as RelationshipType | "all")
            }
          >
            <option value="all">All</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <span className="text-xs text-[--foreground-secondary]">
          {sorted.length} of {relationships.length} shown
        </span>
      </div>

      <div className="overflow-x-auto rounded border border-[--border] bg-[--background]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[--border] bg-[--background-secondary] text-xs font-normal text-[--foreground-secondary]">
            <tr>
              <th
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleSort("name")}
              >
                Name <SortIcon field="name" />
              </th>
              <th
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleSort("ticker")}
              >
                Ticker <SortIcon field="ticker" />
              </th>
              <th className="px-3 py-2">Exchange</th>
              <th
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleSort("type")}
              >
                Type <SortIcon field="type" />
              </th>
              <th
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleSort("strength")}
              >
                Strength <SortIcon field="strength" />
              </th>
              <th
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleSort("score")}
              >
                Score <SortIcon field="score" />
              </th>
              <th
                className="cursor-pointer px-3 py-2"
                onClick={() => toggleSort("hypeRisk")}
              >
                Hype risk <SortIcon field="hypeRisk" />
              </th>
              <th className="px-3 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <RelatedCompanyRow key={r.id} relationship={r} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
