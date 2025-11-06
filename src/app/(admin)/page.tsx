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
import { useRouter } from "next/navigation";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.log("No token found, redirecting to signin");
          router.push("/signin");
          return;
        }
        
        // Verify token with API
        const response = await fetch("/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRole(data.user.role);
        } else {
          console.log("Invalid token or session expired");
          // Clear any invalid tokens
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
    </div>;
  }
  
  if (!role) {
    return router.push("/signin"); // Router will handle redirection
  }
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
