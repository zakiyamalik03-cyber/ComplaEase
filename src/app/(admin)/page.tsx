import type { Metadata } from "next";
import { ComplaintMetrics} from "@/components/ecommerce/ComplaintMetrics";
import React from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlyComplaintChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import RecentOrders from "@/components/ecommerce/RankingEmployees";
// import DemographicCard from "@/components/ecommerce/DemographicCard";
import MonthlyComplaintChart from "@/components/ecommerce/MonthlyComplaintChart";
import RankingEmployees from "@/components/ecommerce/RankingEmployees";

export const metadata: Metadata = {
  title:
    "ComplaEase - Admin Dashboard",
  description: "ComplaEase Admin Dashboard - Monitor course analytics, track student progress, manage instructors, and oversee platform performance with real-time insights and comprehensive reporting tools.",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <ComplaintMetrics />
        <MonthlyComplaintChart />
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
        <RankingEmployees />
      </div>
    </div>
  );
}
// "use client";
// import { useSession } from "next-auth/react";
// import StudentView from "@/components/StudentView";
// import StaffView from "@/components/StaffView";
// import ManagerView from "@/components/ManagerView";
// import AdminView from "@/components/AdminView";

// export default function Dashboard() {
//   const { data: session, status } = useSession();

//   if (status === "loading") return <p>Loading...</p>;
//   if (!session) return <p>Please login to continue</p>;

//   const role = session.user.role;

//   return (
//     <main className="p-6">
//       {role === "student" && <StudentView />}
//       {role === "staff" && <StaffView />}
//       {role === "manager" && <ManagerView />}
//       {role === "admin" && <AdminView />}
//     </main>
//   );
// }
