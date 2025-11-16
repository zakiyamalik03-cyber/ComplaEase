import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComplaintsTable from "./ComplaintsTable";
import { Metadata } from "next";
import React from "react";
import { ComplaintTableItem } from "@/types/global";
0
export const metadata: Metadata = {
  title: "Complaint List | ComplaEase ",
  description:
    "This is Next.js Complaint List page for ComplaEase Admin Dashboard",
  // other metadata
};



export default async function ComplaintsTables() {
  // 👇 Fetch from API route (server-side)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/complaint/getComplaints`, {
    cache: "no-store",
  });
  const result = await res.json();
  const tableData: ComplaintTableItem[] = result?.data || [];
  console.log("the Complaints: ", tableData);
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Complaint List" />
      <div className="space-y-6">
        <ComponentCard title="Complaint List">
          <ComplaintsTable complaints={tableData} />
        </ComponentCard>
      </div>
    </div>
  );
}
