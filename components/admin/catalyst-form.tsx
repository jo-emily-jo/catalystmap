"use client";

import { useFormState } from "react-dom";
import {
  createCatalystAction,
  updateCatalystAction,
  type CatalystActionState,
} from "@/app/admin/actions/catalyst-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { CatalystCompany, Theme } from "@/lib/types";

interface CatalystFormProps {
  catalyst?: CatalystCompany;
  themes: Theme[];
}

const initial: CatalystActionState = { success: false };

export function CatalystForm({ catalyst, themes }: CatalystFormProps) {
  const action = catalyst ? updateCatalystAction : createCatalystAction;
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      {catalyst && <input type="hidden" name="id" value={catalyst.id} />}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Saved</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={catalyst?.slug ?? ""}
            placeholder="e.g. anthropic"
          />
          {state.fieldErrors?.slug && (
            <p className="mt-1 text-xs text-red-600">
              {state.fieldErrors.slug[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={catalyst?.name ?? ""}
            placeholder="Company name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country (ISO)</Label>
          <Input
            id="country"
            name="country"
            defaultValue={catalyst?.country ?? "US"}
            placeholder="US"
            maxLength={2}
          />
        </div>
        <div>
          <Label htmlFor="isPublic">Public company?</Label>
          <Select
            id="isPublic"
            name="isPublic"
            defaultValue={catalyst?.isPublic ? "true" : "false"}
          >
            <option value="false">Private</option>
            <option value="true">Public</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ticker">Ticker</Label>
          <Input
            id="ticker"
            name="ticker"
            defaultValue={catalyst?.ticker ?? ""}
            placeholder="Required if public"
          />
        </div>
        <div>
          <Label htmlFor="exchange">Exchange</Label>
          <Input
            id="exchange"
            name="exchange"
            defaultValue={catalyst?.exchange ?? ""}
            placeholder="NASDAQ, NYSE, KRX..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Short description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          defaultValue={catalyst?.shortDescription ?? ""}
          placeholder="1–2 sentences"
        />
      </div>

      <div>
        <Label htmlFor="thesisMd">Thesis (markdown)</Label>
        <Textarea
          id="thesisMd"
          name="thesisMd"
          rows={6}
          defaultValue={catalyst?.thesisMd ?? ""}
          placeholder="Why this catalyst matters now..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="foundedYear">Founded year</Label>
          <Input
            id="foundedYear"
            name="foundedYear"
            type="number"
            defaultValue={catalyst?.foundedYear ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            defaultValue={catalyst?.website ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <Label>Themes</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {themes.map((t) => (
            <label key={t.id} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="themeIds"
                value={t.id}
                defaultChecked={catalyst?.themes.some((ct) => ct.id === t.id)}
              />
              {t.name}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit">
        {catalyst ? "Update catalyst" : "Create catalyst"}
      </Button>
    </form>
  );
}
