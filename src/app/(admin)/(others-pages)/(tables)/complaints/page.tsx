import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComplaintsTable from "./ComplaintsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Complaint List | ComplaEase ",
  description:
    "This is Next.js Complaint List page for ComplaEase Admin Dashboard",
  // other metadata
};
interface Complaint {
  id: number;
  user: {
    image: string;
    name: string;
    email: string;
  };
  category: string;
  subject: string;
  priority: string;
  status: string;
  date: string;
}



interface Complaint {
  id: number;
  title: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  image: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}
export default async function ComplaintsTables() {
   // 👇 Fetch from API route (server-side)
  const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const res = await fetch(`${baseUrl}/api/complaint/getComplaints`, {
  cache: "no-store",
});

  const result = await res.json();
  const complaints: Complaint[] = result?.data || [];

  console.log("Fetched complaints:", complaints);

  // 🧠 Transform DB structure to UI structure if needed
  const formattedComplaints = complaints.map((c) => ({
    id: c.id,
    user: {
      image: c.image || "/images/default-avatar.png",
      name: c.created_by || "Unknown User",
      email: `${c.created_by}@complaease.com`, // fake email for UI
    },
    category: c.category,
    subject: c.title,
    priority: c.priority,
    status: c.status,
    date: new Date(c.created_at).toLocaleDateString(),
  }));
  
  console.log("the complaints : ", formattedComplaints);

  return (
    <div>
      <PageBreadcrumb pageTitle="Complaint List" />
      <div className="space-y-6">
        <ComponentCard title="Complaint List">
          <ComplaintsTable complaints={formattedComplaints} />
        </ComponentCard>
      </div>
    </div>
  );
}
