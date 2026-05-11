import type { Theme } from "@/lib/types";

const THEME_COLORS: Record<string, string> = {
  ai: "bg-purple-50 text-purple-700",
  semiconductors: "bg-blue-50 text-blue-700",
  space: "bg-indigo-50 text-indigo-700",
  defense: "bg-red-50 text-red-700",
  "data-center": "bg-cyan-50 text-cyan-700",
  robotics: "bg-orange-50 text-orange-700",
  energy: "bg-green-50 text-green-700",
  biotech: "bg-pink-50 text-pink-700",
};

const DEFAULT_COLOR = "bg-gray-50 text-gray-700";

export function ThemeBadge({ theme }: { theme: Theme }) {
  const color = THEME_COLORS[theme.slug] ?? DEFAULT_COLOR;
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-normal ${color}`}
    >
      {theme.name}
    </span>
  );
}
