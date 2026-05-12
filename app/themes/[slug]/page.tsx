import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getThemeBySlug } from "@/lib/db/themes";
import { listCatalystsByTheme } from "@/lib/db/catalysts";
import { CatalystCard } from "@/components/catalyst-card";
import { ThemeEmptyState } from "@/components/theme-empty-state";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const theme = await getThemeBySlug(params.slug);
  if (!theme) return { title: "Not found — CatalystMap" };

  return {
    title: `${theme.name} — CatalystMap`,
    description: theme.description,
  };
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const theme = await getThemeBySlug(params.slug);
  if (!theme) notFound();

  const catalysts = await listCatalystsByTheme(params.slug);
  const isEmpty = catalysts.length === 0;

  return (
    <>
      {isEmpty && <meta name="robots" content="noindex" />}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link
          href="/themes"
          className="mb-6 inline-block text-sm text-[--foreground-secondary] hover:text-[--foreground]"
        >
          &larr; All themes
        </Link>

        <h1 className="text-2xl font-medium text-[--foreground]">
          {theme.name}
        </h1>
        {theme.description && (
          <p className="mt-2 text-sm text-[--foreground-secondary]">
            {theme.description}
          </p>
        )}

        {isEmpty ? (
          <div className="mt-8">
            <ThemeEmptyState theme={theme} />
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="mb-4 text-base font-medium text-[--foreground]">
              Catalyst companies in this theme
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {catalysts.map((c) => (
                <CatalystCard key={c.id} catalyst={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
