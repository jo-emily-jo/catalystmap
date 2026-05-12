import { createClient } from "@supabase/supabase-js";
import { computeRelevanceScore } from "../lib/scoring/compute-relevance-score";
import { SCORING_VERSION } from "../lib/scoring/version";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log(
    "Recomputing all scores (SCORING_VERSION=%d)...\n",
    SCORING_VERSION
  );

  // Fetch all active relationships with their sources
  const { data: relationships, error } = await supabase
    .from("relationships")
    .select("*, sources(*)")
    .eq("is_active", true);

  if (error) throw error;
  if (!relationships || relationships.length === 0) {
    console.log("No active relationships found.");
    return;
  }

  const now = new Date();
  let updated = 0;
  let snapshotsAdded = 0;

  for (const rel of relationships) {
    const sourceQualities = (rel.sources ?? []).map(
      (s: { source_quality: number }) => s.source_quality
    );

    const oldScore = rel.relevance_score;

    const { score, breakdown } = computeRelevanceScore(
      {
        relationshipType: rel.relationship_type,
        relationshipStrength: rel.relationship_strength,
        revenueExposurePct: rel.revenue_exposure_pct,
        sourceQualities,
        lastVerifiedAt: new Date(rel.last_verified_at),
        hypeRisk: rel.hype_risk,
        contractValueUsd: rel.contract_value_usd,
        isGovernmentProcurement: rel.is_government_procurement,
      },
      now
    );

    // Update relationship row
    const { error: updateError } = await supabase
      .from("relationships")
      .update({
        relevance_score: score,
        score_version: SCORING_VERSION,
        score_breakdown: breakdown,
      })
      .eq("id", rel.id);

    if (updateError) {
      console.error(`  Failed to update ${rel.id}: ${updateError.message}`);
      continue;
    }
    console.log(
      `  ${rel.relationship_type}/${rel.relationship_strength}: ${oldScore} → ${score} (${score > oldScore ? "+" : ""}${(score - (oldScore ?? 0)).toFixed(1)})`
    );
    updated++;

    // Append score snapshot
    const { error: snapshotError } = await supabase
      .from("score_snapshots")
      .insert({
        relationship_id: rel.id,
        score,
        score_version: SCORING_VERSION,
        breakdown,
      });

    if (snapshotError) {
      console.error(`  Failed to snapshot ${rel.id}: ${snapshotError.message}`);
      continue;
    }
    snapshotsAdded++;
  }

  console.log(
    `Done. ${updated} relationships updated, ${snapshotsAdded} snapshots added.`
  );
}

main().catch((err) => {
  console.error("Recompute failed:", err);
  process.exit(1);
});
