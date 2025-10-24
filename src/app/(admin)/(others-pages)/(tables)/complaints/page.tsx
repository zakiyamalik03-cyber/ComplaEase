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

export default function ComplaintsTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Complaint List" />
      <div className="space-y-6">
        <ComponentCard title="Complaint List">
          <ComplaintsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
