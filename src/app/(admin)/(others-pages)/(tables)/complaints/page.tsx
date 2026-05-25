import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComplaintsTable from "./ComplaintsTable";
import { Metadata } from "next";
import { ComplaintTableItem } from "@/types/global";

export const metadata: Metadata = {
  title: "Complaint List | ComplaEase ",
  description:
    "This is Next.js Complaint List page for ComplaEase Admin Dashboard",
  // other metadata
};

export default async function ComplaintsTables() {
  // Build absolute URL for server-side fetch
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  let complaints: ComplaintTableItem[] = [];

  try {
    // Ensure fetch is called with an absolute URL
    const cookieStore = await (await import("next/headers")).cookies();
    const res = await fetch(`${baseUrl}/api/complaint/getComplaints`, {
      cache: "no-store",
      headers: {
        // Forward the cookie header so the API can read the auth session
        cookie: cookieStore.toString(),
      },
    });

    if (!res.ok) {
      // Instead of throwing, log and leave complaints as empty array
      console.error(`API responded with status ${res.status}`);
    } else {
      const result = await res.json();
      complaints = result?.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Complaint List" />
      <div className="space-y-6">
        <ComponentCard title="Complaint List">
          <ComplaintsTable complaints={complaints} />
        </ComponentCard>
      </div>
    </div>
  );
}
