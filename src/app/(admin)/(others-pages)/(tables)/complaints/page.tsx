import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComplaintsTable from "./ComplaintsTable";
import { Metadata } from "next";
import React from "react";
import { Complaint } from "@/types/global";
import { User } from "next-auth";

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
  const complaints: Complaint[] = result?.data || [];

  const res2 = await fetch(`${baseUrl}/api/users/getUsers`, {
    cache: "no-store",
  });
  const resultUsers = await res2.json();
  const users: User[] = resultUsers?.data || [];

  const formattedComplaints = complaints.map((c) => {
    const creator = users.find((u) => u.id === c.created_by) || {
      image: "/images/default-avatar.png",
      name: "Unknown",
      email: "",
    };
    return {
      id: c.id,
      user: [creator],
      category: c.category,
      subject: c.title,
      priority: c.priority,
      status: c.status,
      date: new Date(c.created_at).toLocaleDateString(),
    };
  });

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
