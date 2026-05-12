import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { CatalystCompany } from "@/lib/types";

export function CatalystCard({ catalyst }: { catalyst: CatalystCompany }) {
  return (
    <Link
      href={`/catalyst/${catalyst.slug}`}
      aria-label={`Open catalyst page for ${catalyst.name}`}
    >
      <Card className="h-full transition-colors hover:border-indigo-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium text-[--foreground]">
                {catalyst.name}
              </h3>
              {catalyst.isPublic && catalyst.ticker && (
                <span className="rounded bg-[--background-secondary] px-1.5 py-0.5 font-mono text-xs text-[--foreground-secondary]">
                  {catalyst.ticker}
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-normal ${
                  catalyst.isPublic
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {catalyst.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[--foreground-secondary]" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[--foreground-secondary]">
            {catalyst.shortDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
