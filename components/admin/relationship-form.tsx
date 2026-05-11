"use client";

import { useFormState } from "react-dom";
import {
  updateRelationshipAction,
  type RelationshipActionState,
} from "@/app/admin/actions/relationship-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Relationship } from "@/lib/types";

const initial: RelationshipActionState = { success: false };

export function RelationshipForm({
  relationship,
}: {
  relationship: Relationship;
}) {
  const [state, formAction] = useFormState(updateRelationshipAction, initial);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" value={relationship.id} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Saved</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relationshipType">Type</Label>
          <Select
            id="relationshipType"
            name="relationshipType"
            defaultValue={relationship.relationshipType}
          >
            {[
              "investment",
              "customer",
              "supplier",
              "partnership",
              "infrastructure",
              "thematic",
              "speculative",
            ].map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="relationshipStrength">Strength</Label>
          <Select
            id="relationshipStrength"
            name="relationshipStrength"
            defaultValue={relationship.relationshipStrength}
          >
            {["direct", "indirect", "speculative"].map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={relationship.summary}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="revenueExposurePct">Revenue exposure %</Label>
          <Input
            id="revenueExposurePct"
            name="revenueExposurePct"
            type="number"
            step="0.01"
            defaultValue={relationship.revenueExposurePct ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="lastVerifiedAt">Last verified</Label>
          <Input
            id="lastVerifiedAt"
            name="lastVerifiedAt"
            type="date"
            defaultValue={relationship.lastVerifiedAt}
          />
        </div>
        <div>
          <Label htmlFor="hypeRisk">Hype risk</Label>
          <Select
            id="hypeRisk"
            name="hypeRisk"
            defaultValue={relationship.hypeRisk}
          >
            {["low", "medium", "high"].map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Button type="submit">Update relationship</Button>
    </form>
  );
}
