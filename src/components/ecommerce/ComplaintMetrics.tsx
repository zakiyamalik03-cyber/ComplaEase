"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { CircleCheckBig, ClipboardClock } from "lucide-react"
import { AlertIcon, ArrowDownIcon, ArrowUpIcon, BoxIconLine } from "@/icons";
import { Complaint } from "@/types/global";


export default function ComplaintMetrics({ complaints = [] }: { complaints: Complaint[] }) {
  const report = (status: string | "") => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const baseFilter = (c: Complaint) => {
      const d = new Date(c.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    };

    const prevBaseFilter = (c: Complaint) => {
      const d = new Date(c.created_at);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    };

    const statusFilter = (c: Complaint) => (status ? c.status === status : true);

    const currentMonthCount = complaints.filter(c => baseFilter(c) && statusFilter(c)).length;
    const prevMonthCount = complaints.filter(c => prevBaseFilter(c) && statusFilter(c)).length;

    if (prevMonthCount === 0) return currentMonthCount;
    const change = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Complaints
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {complaints.length}
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              {report("")}
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <CircleCheckBig className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Completed Complaints
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {complaints.filter((complaint) => complaint.status === "Completed").length}
              </h4>
            </div>

            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />
              {report("Completed")}
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <AlertIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Rejected Complaints
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {complaints.filter((complaint) => complaint.status === "Rejected").length}
              </h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              {report("Rejected")}
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}

        {/* <!-- Metric Item Start --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <ClipboardClock className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Pending Complaints
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {complaints.filter((complaint) => complaint.status === "Pending").length}
              </h4>
            </div>

            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />
              {report("Pending")}
            </Badge>
          </div>
        </div>
        {/* <!-- Metric Item End --> */}
      </div>
    </>
  );
};
