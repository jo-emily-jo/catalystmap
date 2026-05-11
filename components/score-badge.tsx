export function ScoreBadge({ score }: { score: number }) {
  const display = Math.round(score);
  return (
    <span className="inline-block min-w-[2.5rem] rounded bg-indigo-50 px-2 py-0.5 text-center font-mono text-xs font-medium text-indigo-700">
      {display}
    </span>
  );
}
