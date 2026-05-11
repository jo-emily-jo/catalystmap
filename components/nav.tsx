import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b border-[--border] bg-[--background]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-base font-medium text-[--foreground]">
          CatalystMap
        </Link>
        <div className="flex items-center gap-6 text-sm text-[--foreground-secondary]">
          <Link href="/themes" className="hover:text-[--foreground]">
            Themes
          </Link>
          <Link href="/catalysts" className="hover:text-[--foreground]">
            Catalysts
          </Link>
          <Link href="/search" className="hover:text-[--foreground]">
            Search
          </Link>
        </div>
      </div>
    </nav>
  );
}
