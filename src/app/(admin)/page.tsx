import type { Metadata } from "next";
import { StudentsMetrics } from "@/components/ecommerce/StudentsMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentStudents";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import RecentStudents from "@/components/ecommerce/RecentStudents";

export const metadata: Metadata = {
  title:
    "DevDoz Portal - Admin Dashboard",
  description: "DevDoz Portal Admin Dashboard - Monitor course analytics, track student progress, manage instructors, and oversee platform performance with real-time insights and comprehensive reporting tools.",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <StudentsMetrics />

        <MonthlySalesChart />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div> */}

      <div className="col-span-12 xl:col-span-12">
        <RecentStudents />
      </div>
    </div>
  );
}
