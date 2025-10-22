import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Students Table | DevDoz Portal ",
  description:
    "This is Next.js Students Table page for DevDoz Portal Tailwind CSS Admin Dashboard",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Students Table" />
      <div className="space-y-6">
        <ComponentCard title="Students Table">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
