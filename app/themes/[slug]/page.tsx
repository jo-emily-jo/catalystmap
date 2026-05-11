import Link from "next/link";

interface PageProps {
  params: { slug: string };
}

export default function ThemePage({ params }: PageProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <p className="text-sm text-[--foreground-secondary]">
        Theme:{" "}
        <span className="font-medium text-[--foreground]">{params.slug}</span>
      </p>
      <h1 className="mt-2 text-xl font-medium text-[--foreground]">
        Coming soon
      </h1>
      <p className="mt-2 text-sm text-[--foreground-secondary]">
        Catalyst companies for this theme will be listed here.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-accent hover:underline"
      >
        Back to all themes
      </Link>
    </div>
  );
}
