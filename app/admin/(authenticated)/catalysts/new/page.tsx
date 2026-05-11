import { listThemes } from "@/lib/db/themes";
import { CatalystForm } from "@/components/admin/catalyst-form";

export const dynamic = "force-dynamic";

export default async function NewCatalystPage() {
  const themes = await listThemes();

  return (
    <div>
      <h1 className="text-xl font-medium text-[--foreground]">New catalyst</h1>
      <div className="mt-6">
        <CatalystForm themes={themes} />
      </div>
    </div>
  );
}
