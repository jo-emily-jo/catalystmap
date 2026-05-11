import { listCatalysts } from "@/lib/db/catalysts";
import { ResearchClient } from "./research-client";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const catalysts = await listCatalysts();

  return (
    <div>
      <h1 className="text-xl font-medium text-[--foreground]">
        AI-assisted research
      </h1>
      <p className="mt-1 text-sm text-[--foreground-secondary]">
        Select a catalyst and let AI propose related public companies. Nothing
        is saved until you approve each candidate.
      </p>
      <div className="mt-6">
        <ResearchClient catalysts={catalysts} />
      </div>
    </div>
  );
}
