import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";
import ComplaintFeeback from "./complaint-page/ComplaintFeeback";
import { ComplaintTableItem } from "@/types/global";
import ComplaintDetailsCard from "./complaint-page/ComplaintDetailsCard";
import ComplaintentDetails from "./complaint-page/ComplaintentDetails";

export const metadata: Metadata = {
  title: "Complaint Details | ComplaEase - Admin Dashboard",
  description:
    "Admin view for detailed complaint information and status management",
};

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 👇 Fetch from API route (server-side)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // Forward auth token from cookies to authorize server-side fetch
  const cookieStore = await cookies();
  const bearer =
    cookieStore.get("auth-token")?.value || cookieStore.get("token")?.value || "";

  const res = await fetch(`${baseUrl}/api/complaint/getComplaints`, {
    cache: "no-store",
    headers: bearer ? { Authorization: `Bearer ${bearer}` } : undefined,
  });
  const result = await res.json();
  const complaints: ComplaintTableItem[] = result?.data || [];
  // console.log("the complaints ", complaints);

  // Find the complaint by slug (ID)
  const complaint = complaints.find((c) => c.complaint_id === slug);
  // console.log("the complaint: ", complaint);

  if (!complaint) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Complaint Not Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          The requested complaint could not be found.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Complaint Details
        </h3>

        <div className="space-y-6">
          <ComplaintentDetails user={complaint.user as any} />
          <ComplaintDetailsCard complaint={complaint as any} />
          <ComplaintFeeback complaintId={complaint.id} />
        </div>
      </div>
    </div>
  );
}
