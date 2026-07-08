"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userData, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const role = String(userData?.role || (typeof window !== "undefined" ? localStorage.getItem("role") : "") || "").toLowerCase();
  const staffRoles = ["staff", "it staff", "maintenance staff", "electrical staff", "cleaning staff"];
  const forbiddenPaths = ["/staff", "/add-staff", "/add-complaint"];
  const isForbidden = staffRoles.includes(role) && forbiddenPaths.some(p => pathname === p || pathname.startsWith(p + "/"));

  useEffect(() => {
    if (isForbidden) {
      router.replace("/profile");
    }
  }, [isForbidden, router]);

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  if (isForbidden) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen xl:flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        >
          {/* Header */}
          <AppHeader />
          {/* Page Content */}
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}