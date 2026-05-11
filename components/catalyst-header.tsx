import type { CatalystCompany } from "@/lib/types";
import { ThemeBadge } from "./theme-badge";
import Markdown from "react-markdown";

export function CatalystHeader({ catalyst }: { catalyst: CatalystCompany }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-medium text-[--foreground]">
          {catalyst.name}
        </h1>
        {catalyst.themes.map((t) => (
          <ThemeBadge key={t.slug} theme={t} />
        ))}
        {catalyst.isPublic && catalyst.ticker && (
          <span className="font-mono text-sm text-[--foreground-secondary]">
            {catalyst.exchange}:{catalyst.ticker}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-[--foreground-secondary]">
        {catalyst.shortDescription}
      </p>
      <div className="mt-4 rounded border border-[--border] bg-[--background] p-5">
        <h2 className="text-xs font-medium tracking-wide text-[--foreground-secondary]">
          Why this matters now
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[--foreground] [&_strong]:font-medium [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_li]:text-[--foreground-secondary]">
          <Markdown>{catalyst.thesisMd}</Markdown>
        </div>
      </div>
    </div>
  );
}
