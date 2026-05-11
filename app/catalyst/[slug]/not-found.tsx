import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-xl font-medium text-[--foreground]">
        Catalyst not found
      </h1>
      <p className="mt-2 text-sm text-[--foreground-secondary]">
        This catalyst company does not exist or has been retired.
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
