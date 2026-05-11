"use client";

import { useFormState } from "react-dom";
import {
  addSourceAction,
  type SourceActionState,
} from "@/app/admin/actions/source-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { sourceTypeValues } from "@/lib/validations/source";

const initial: SourceActionState = { success: false };

export function SourceForm({ relationshipId }: { relationshipId: string }) {
  const [state, formAction] = useFormState(addSourceAction, initial);

  return (
    <form
      action={formAction}
      className="space-y-3 rounded border border-[--border] p-4"
    >
      <input type="hidden" name="relationshipId" value={relationshipId} />

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.urlWarning && (
        <p className="text-sm text-amber-600">Warning: {state.urlWarning}</p>
      )}
      {state.success && <p className="text-sm text-green-600">Source added</p>}

      <div>
        <Label htmlFor="url">URL</Label>
        <Input id="url" name="url" placeholder="https://..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sourceType">Source type</Label>
          <Select id="sourceType" name="sourceType">
            {sourceTypeValues.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Source title" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="accessedAt">Accessed</Label>
          <Input
            id="accessedAt"
            name="accessedAt"
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div>
          <Label htmlFor="publishedAt">Published</Label>
          <Input id="publishedAt" name="publishedAt" type="date" />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          placeholder="Key quote..."
        />
      </div>

      <Button type="submit" size="sm">
        Add source
      </Button>
    </form>
  );
}
