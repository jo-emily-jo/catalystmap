import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ThemeCardProps {
  name: string;
  slug: string;
  description: string;
  catalystCount?: number;
}

export function ThemeCard({
  name,
  slug,
  description,
  catalystCount,
}: ThemeCardProps) {
  return (
    <Link href={`/themes/${slug}`}>
      <Card className="h-full transition-colors hover:border-indigo-200">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
          {catalystCount != null && (
            <p className="mt-2 font-mono text-xs text-[--foreground-secondary]">
              {catalystCount} {catalystCount === 1 ? "catalyst" : "catalysts"}
            </p>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
