import type { Theme } from "@/lib/types";

export function ThemeEmptyState({ theme }: { theme: Theme }) {
  return (
    <div className="rounded border border-[--border] bg-[--background] p-8">
      <h2 className="text-lg font-medium text-[--foreground]">{theme.name}</h2>
      {theme.description && (
        <p className="mt-2 text-sm text-[--foreground-secondary]">
          {theme.description}
        </p>
      )}
      <p className="mt-4 text-sm text-[--foreground-secondary]">
        We&apos;re actively curating supply-chain relationships for this theme.
        Check back as catalysts are added.
      </p>
    </div>
  );
}
