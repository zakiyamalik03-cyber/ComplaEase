import { Metadata } from "next";
import React from "react";
import ComplaintActionsCard from "./complaint-page/ComplaintentDetails";
import ComplaintFeeback from "./complaint-page/ComplaintFeeback";
import { ComplaintDetail } from "@/types/global";
import ComplaintDetailsCard from "./complaint-page/ComplaintDetailsCard";

export const metadata: Metadata = {
  title: "Complaint Details | ComplaEase - Admin Dashboard",
  description:
    "Admin view for detailed complaint information and status management",
};

async function getComplaint(id: string): Promise<ComplaintDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const complaintRes = await fetch(
      `${baseUrl}/api/complaint/get-complaint/${id}`,
      { cache: 'no-store' }
    );

    if (!complaintRes.ok) {
      console.error(`Fetch failed with status ${complaintRes.status}`);
      return null;
    }

    const complaintData = await complaintRes.json();

    if (!complaintData?.success || !complaintData?.data) {
      console.error('API response missing success or data');
      return null;
    }

    return complaintData.data as ComplaintDetail;
  } catch (error) {
    console.error("Error fetching complaint:", error);
    return null;
  }
}

export default async function ComplaintDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const complaint = await getComplaint(params.slug);
  
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
          <ComplaintActionsCard user={complaint.user} />
          <ComplaintDetailsCard complaint={complaint} />
          <ComplaintFeeback />
        </div>
      </div>
    </div>
  );
}
