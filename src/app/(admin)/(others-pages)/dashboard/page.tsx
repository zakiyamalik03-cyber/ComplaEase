"use client";
import React, { useEffect, useState } from "react";
import MonthlyComplaintChart from "@/components/ecommerce/MonthlyComplaintChart";
import { useRouter } from "next/navigation";
import ComplaintMetrics from "@/components/ecommerce/ComplaintMetrics";
import { Complaint } from "@/types/global";
import LatestComplaints from "@/components/ecommerce/LatestComplaints";

export default function Home() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const router = useRouter();

    // Authentication check
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/signin");
                    return;
                }

                const response = await fetch("/api/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRole(data.user.role);
                } else {
                    localStorage.removeItem("token");
                    router.push("/signin");
                }
            } catch (error) {
                console.error("Auth error:", error);
                router.push("/signin");
            } finally {
                setLoading(false);
            }
        };


        checkAuth();
    }, [router]);

    // Fetch complaints once authenticated
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const baseUrl =
                    process.env.NEXT_PUBLIC_BASE_URL ||
                    (process.env.VERCEL_URL
                        ? `https://${process.env.VERCEL_URL}`
                        : "http://localhost:3000");

                const res = await fetch(`${baseUrl}/api/complaint/getComplaints`, {
                    cache: "no-store",
                });

                const result = await res.json();
                setComplaints(result?.data || []);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        if (role) fetchComplaints();
    }, [role]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    if (!role) return null;

    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 space-y-6 xl:col-span-12">
                <ComplaintMetrics complaints={complaints} />
                <MonthlyComplaintChart complaints={complaints} />
            </div>

            {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

            <div className="col-span-12 xl:col-span-12">
                <LatestComplaints />
            </div>
        </div>
    );
}
