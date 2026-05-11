import { ThemeCard } from "@/components/theme-card";

const THEMES = [
  {
    name: "AI",
    slug: "ai",
    description:
      "Artificial intelligence, large language models, and frontier AI labs.",
  },
  {
    name: "Semiconductors",
    slug: "semiconductors",
    description:
      "Advanced chip design, memory, EUV lithography, and packaging.",
  },
  {
    name: "Space",
    slug: "space",
    description:
      "Launch vehicles, satellite constellations, and orbital infrastructure.",
  },
  {
    name: "Defense",
    slug: "defense",
    description:
      "Defense contractors, national security technology, and dual-use systems.",
  },
  {
    name: "Data center",
    slug: "data-center",
    description:
      "Hyperscale infrastructure, cooling, power, and networking equipment.",
  },
  {
    name: "Robotics",
    slug: "robotics",
    description:
      "Industrial automation, humanoid robots, and autonomous systems.",
  },
  {
    name: "Energy",
    slug: "energy",
    description:
      "Energy transition, nuclear, renewables, grid infrastructure, and storage.",
  },
  {
    name: "Biotech",
    slug: "biotech",
    description: "Drug discovery, genomics, CRISPR, and computational biology.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-medium text-[--foreground]">
        Explore by theme
      </h1>
      <p className="mt-2 text-sm text-[--foreground-secondary]">
        Browse catalyst companies driving major market narratives, mapped to
        publicly traded companies with evidence-based exposure.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {THEMES.map((theme) => (
          <ThemeCard key={theme.slug} {...theme} />
        ))}
      </div>
    </div>
  );
}
