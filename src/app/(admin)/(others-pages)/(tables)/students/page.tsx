import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import StudentsTable from "./StudentsTable";

export const metadata: Metadata = {
  title: "Students Table | ComplaEase ",
  description:
    "This is Next.js Students Table page for ComplaEase Tailwind CSS Admin Dashboard",
  // other metadata
};

export default function StudentsTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Students Table" />
      <div className="space-y-6">
        <ComponentCard title="Students Table">
          <StudentsTable />
        </ComponentCard>
      </div>
    </div>
  );
}
