import Link from "next/link";
import { getServerClient } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = getServerClient();

  const [catalysts, relationships, sources] = await Promise.all([
    supabase
      .from("catalyst_companies")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("relationships")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("sources").select("id", { count: "exact", head: true }),
  ]);

  return {
    catalysts: catalysts.count ?? 0,
    relationships: relationships.count ?? 0,
    sources: sources.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  return (
    <div>
      <h1 className="text-xl font-medium text-[--foreground]">Dashboard</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Link href="/admin/catalysts">
          <Card className="transition-colors hover:border-[--border-emphasis]">
            <CardContent className="pt-6">
              <div className="font-mono text-2xl font-medium text-[--foreground]">
                {counts.catalysts}
              </div>
              <div className="mt-1 text-xs text-[--foreground-secondary]">
                Catalysts
              </div>
            </CardContent>
          </Card>
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="font-mono text-2xl font-medium text-[--foreground]">
              {counts.relationships}
            </div>
            <div className="mt-1 text-xs text-[--foreground-secondary]">
              Relationships
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="font-mono text-2xl font-medium text-[--foreground]">
              {counts.sources}
            </div>
            <div className="mt-1 text-xs text-[--foreground-secondary]">
              Sources
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/admin/catalysts/new">+ Add catalyst</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/research">AI-assisted research</Link>
        </Button>
      </div>
    </div>
  );
}
