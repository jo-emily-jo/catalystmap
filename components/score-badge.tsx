"use client";

import type { ScoreBreakdown } from "@/lib/types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScoreBreakdownPanel } from "@/components/score-breakdown";

export function ScoreBadge({
  score,
  breakdown,
}: {
  score: number;
  breakdown?: ScoreBreakdown | null;
}) {
  const display = Math.round(score);
  const badge = (
    <span
      role="button"
      tabIndex={0}
      className="inline-block min-w-[2.5rem] cursor-pointer rounded bg-indigo-50 px-2 py-0.5 text-center font-mono text-xs font-medium text-indigo-700"
    >
      {display}
    </span>
  );

  if (!breakdown) return badge;

  return (
    <Popover>
      <PopoverTrigger asChild aria-label="View score breakdown">
        {badge}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64">
        <ScoreBreakdownPanel breakdown={breakdown} />
      </PopoverContent>
    </Popover>
  );
}
