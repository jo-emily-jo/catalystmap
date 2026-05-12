import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-xl font-medium text-[--foreground]">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-[--foreground-secondary]">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm text-accent hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
