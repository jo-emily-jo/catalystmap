export function EmptyState({ companyName }: { companyName: string }) {
  return (
    <div className="rounded border border-dashed border-[--border] px-6 py-12 text-center">
      <p className="text-sm text-[--foreground-secondary]">
        No related public companies mapped yet for{" "}
        <span className="font-medium text-[--foreground]">{companyName}</span>.
      </p>
    </div>
  );
}
