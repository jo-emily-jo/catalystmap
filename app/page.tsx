import { ThemeCard } from "@/components/theme-card";
import { listThemes } from "@/lib/db/themes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const themes = await listThemes();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-medium text-[--foreground]">
        Explore by theme
      </h1>
      <p className="mt-2 text-sm text-[--foreground-secondary]">
        Browse catalyst companies driving major market narratives, mapped to
        publicly traded companies with evidence-based exposure.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.slug}
            name={theme.name}
            slug={theme.slug}
            description={theme.description ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
