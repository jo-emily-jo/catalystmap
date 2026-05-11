import Link from "next/link";
import { listCatalysts } from "@/lib/db/catalysts";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCatalystsPage() {
  const catalysts = await listCatalysts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-[--foreground]">Catalysts</h1>
        <Link
          href="/admin/catalysts/new"
          className="rounded bg-accent px-3 py-1.5 text-sm text-white hover:opacity-90"
        >
          + New catalyst
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {catalysts.length === 0 && (
          <p className="text-sm text-[--foreground-secondary]">
            No catalysts yet.
          </p>
        )}
        {catalysts.map((c) => (
          <Link
            key={c.id}
            href={`/admin/catalysts/${c.slug}`}
            className="flex items-center justify-between rounded border border-[--border] bg-[--background] p-3 hover:border-[--border-emphasis]"
          >
            <div>
              <span className="text-sm font-medium text-[--foreground]">
                {c.name}
              </span>
              <span className="ml-2 font-mono text-xs text-[--foreground-secondary]">
                {c.slug}
              </span>
            </div>
            <div className="flex gap-1">
              {c.themes.map((t) => (
                <Badge key={t.id}>{t.name}</Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
