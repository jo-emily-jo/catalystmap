"use client";

import { useFormState } from "react-dom";
import {
  createRelatedCompanyAction,
  updateRelatedCompanyAction,
  type RelatedCompanyActionState,
} from "@/app/admin/actions/related-company-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { RelatedCompany } from "@/lib/types";

const initial: RelatedCompanyActionState = { success: false };

export function RelatedCompanyForm({ company }: { company?: RelatedCompany }) {
  const action = company
    ? updateRelatedCompanyAction
    : createRelatedCompanyAction;
  const [state, formAction] = useFormState(action, initial);

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {company && <input type="hidden" name="id" value={company.id} />}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">Saved</p>}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ticker">Ticker</Label>
          <Input
            id="ticker"
            name="ticker"
            defaultValue={company?.ticker ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="exchange">Exchange</Label>
          <Input
            id="exchange"
            name="exchange"
            defaultValue={company?.exchange ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            defaultValue={company?.country ?? ""}
            maxLength={2}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={company?.name ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sector">Sector</Label>
          <Input
            id="sector"
            name="sector"
            defaultValue={company?.sector ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            defaultValue={company?.industry ?? ""}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Description</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          defaultValue={company?.shortDescription ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          defaultValue={company?.website ?? ""}
        />
      </div>

      <Button type="submit">
        {company ? "Update company" : "Add company"}
      </Button>
    </form>
  );
}
