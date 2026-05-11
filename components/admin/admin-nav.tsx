import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/catalysts", label: "Catalysts" },
  { href: "/admin/related-companies", label: "Related companies" },
  { href: "/admin/research", label: "AI research" },
];

export function AdminNav() {
  return (
    <nav className="w-56 shrink-0 border-r border-[--border] bg-[--background-secondary] px-4 py-6">
      <div className="mb-6 text-xs font-medium text-[--foreground-secondary]">
        Curator admin
      </div>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded px-3 py-1.5 text-sm text-[--foreground-secondary] hover:bg-[--background] hover:text-[--foreground]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
