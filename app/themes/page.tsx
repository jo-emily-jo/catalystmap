import { ThemeCard } from "@/components/theme-card";
import { listThemes } from "@/lib/db/themes";
import { countCatalystsByTheme } from "@/lib/db/catalysts";

export const dynamic = "force-dynamic";

export default async function ThemesIndexPage() {
  const [themes, counts] = await Promise.all([
    listThemes(),
    countCatalystsByTheme(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-medium text-[--foreground]">Themes</h1>
      <p className="mt-2 text-sm text-[--foreground-secondary]">
        Browse market themes and the catalyst companies driving them.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.slug}
            name={theme.name}
            slug={theme.slug}
            description={theme.description ?? ""}
            catalystCount={counts[theme.slug] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
