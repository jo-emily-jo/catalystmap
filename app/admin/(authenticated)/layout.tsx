import { AdminNav } from "@/components/admin/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-6rem)]">
      <AdminNav />
      <div className="flex-1 px-8 py-6">{children}</div>
    </div>
  );
}
