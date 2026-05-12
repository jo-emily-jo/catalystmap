import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-6rem)]">
      <div className="border-b border-[--border] bg-amber-50 px-4 py-2 text-center text-xs text-amber-800 md:hidden">
        Best viewed on desktop
      </div>
      <AdminNav />
      <div className="flex-1 px-8 py-6">{children}</div>
    </div>
  );
}
