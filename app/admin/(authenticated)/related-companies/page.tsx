import { listRelatedCompanies } from "@/lib/db/related-companies";
import { RelatedCompanyForm } from "@/components/admin/related-company-form";

export const dynamic = "force-dynamic";

export default async function AdminRelatedCompaniesPage() {
  const companies = await listRelatedCompanies();

  return (
    <div>
      <h1 className="text-xl font-medium text-[--foreground]">
        Related companies
      </h1>

      <div className="mt-6 overflow-x-auto rounded border border-[--border]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[--border] bg-[--background-secondary] text-xs text-[--foreground-secondary]">
            <tr>
              <th className="px-3 py-2">Ticker</th>
              <th className="px-3 py-2">Exchange</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Sector</th>
              <th className="px-3 py-2">Country</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr
                key={c.id}
                className="border-t border-[--border] hover:bg-[--background-secondary]"
              >
                <td className="px-3 py-2 font-mono">{c.ticker}</td>
                <td className="px-3 py-2 text-[--foreground-secondary]">
                  {c.exchange}
                </td>
                <td className="px-3 py-2">{c.name}</td>
                <td className="px-3 py-2 text-[--foreground-secondary]">
                  {c.sector ?? "-"}
                </td>
                <td className="px-3 py-2 text-[--foreground-secondary]">
                  {c.country ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-base font-medium text-[--foreground]">
          Add related company
        </h2>
        <RelatedCompanyForm />
      </div>
    </div>
  );
}
