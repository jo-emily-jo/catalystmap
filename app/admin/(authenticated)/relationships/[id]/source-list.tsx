"use client";

import { useState } from "react";
import { deleteSourceAction } from "@/app/admin/actions/source-actions";
import { Button } from "@/components/ui/button";
import type { Source } from "@/lib/types";

interface SourceListProps {
  sources: Source[];
  relationshipId: string;
}

export function SourceList({ sources, relationshipId }: SourceListProps) {
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(sourceId: string) {
    if (!confirm("Delete this source?")) return;
    setDeleting(sourceId);
    setError(null);

    const result = await deleteSourceAction(sourceId, relationshipId);
    if (!result.success) {
      setError(result.error ?? "Delete failed");
    }
    setDeleting(null);
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {sources.map((s) => (
        <div
          key={s.id}
          className="flex items-start justify-between rounded border border-[--border] bg-[--background] p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded bg-[--background-secondary] px-1.5 py-0.5 text-[--foreground-secondary]">
                {s.sourceType.replace(/_/g, " ")}
              </span>
              <span className="font-mono text-[--foreground-secondary]">
                q:{s.sourceQuality}
              </span>
            </div>
            <div className="mt-1 text-sm">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {s.title || s.url}
              </a>
            </div>
            {s.excerpt && (
              <p className="mt-1 text-xs text-[--foreground-secondary]">
                {s.excerpt}
              </p>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 text-red-600 hover:text-red-700"
            onClick={() => handleDelete(s.id)}
            disabled={deleting === s.id}
          >
            {deleting === s.id ? "..." : "Delete"}
          </Button>
        </div>
      ))}
    </div>
  );
}
