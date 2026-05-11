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
}

export function ThemeCard({ name, slug, description }: ThemeCardProps) {
  return (
    <Link href={`/themes/${slug}`}>
      <Card className="h-full transition-colors hover:border-[--border-emphasis]">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
