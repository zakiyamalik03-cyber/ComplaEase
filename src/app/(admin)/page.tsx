"use client";
import { ComplaintMetrics} from "@/components/ecommerce/ComplaintMetrics";
import React, { useEffect, useState } from "react";
// import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
// import MonthlySalesChart from "@/components/ecommerce/MonthlyComplaintChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
// import RecentOrders from "@/components/ecommerce/RankingEmployees";
// import DemographicCard from "@/components/ecommerce/DemographicCard";
import MonthlyComplaintChart from "@/components/ecommerce/MonthlyComplaintChart";
import RankingEmployees from "@/components/ecommerce/RankingEmployees";

export default function Home() {
   const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole as any);
  }, []);

  // if (!role) {
  //   window.location.href = "/signup";
  //   return null;
  // }
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
// import { useEffect, useState } from "react";
// import StudentView from "@/components/StudentView";
// import StaffView from "@/components/StaffView";
// import ManagerView from "@/components/ManagerView";
// import AdminView from "@/components/AdminView";

// export default function Home() {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const storedRole = localStorage.getItem("role");
//     setRole(storedRole);
//   }, []);

//   if (!role) return <p>Please login...</p>;

//   return (
//     <main className="p-6">
//       {role === "student" && <StudentView />}
//       {role === "staff" && <StaffView />}
//       {role === "manager" && <ManagerView />}
//       {role === "admin" && <AdminView />}
//     </main>
//   );
// }
