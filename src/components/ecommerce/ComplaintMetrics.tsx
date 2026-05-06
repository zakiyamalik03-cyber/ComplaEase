"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { CircleCheckBig, ClipboardClock, Pickaxe } from "lucide-react";
import {  ArrowDownIcon, ArrowUpIcon, BoxIconLine } from "@/icons";
import { Complaint } from "@/types/global";

export default function ComplaintMetrics({ complaints = [] }: { complaints: Complaint[] }) {
  const report = (status: string = "") => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const filterByMonth = (c: Complaint, month: number, year: number) => {
      const d = new Date(c.created_at);
      return d.getMonth() === month && d.getFullYear() === year;
    };

    const matchStatus = (c: Complaint) =>
      status ? c.status.toLowerCase() === status.toLowerCase() : true;

    const currentMonthCount = complaints.filter(
      (c) => filterByMonth(c, currentMonth, currentYear) && matchStatus(c)
    ).length;

    const prevMonthCount = complaints.filter(
      (c) => filterByMonth(c, prevMonth, prevYear) && matchStatus(c)
    ).length;

    // No previous data — just show the count
    if (prevMonthCount === 0) return { text: `${currentMonthCount}`, value: 0 };

    const change = ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
    return {
      text: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      value: change,
    };
  };

  const renderBadge = (value: number, text: string) => (
    <Badge color={value >= 0 ? "success" : "error"}>
      {value >= 0 ? (
        <ArrowUpIcon className="text-success-500" />
      ) : (
        <ArrowDownIcon className="text-error-500" />
      )}
      {text}
    </Badge>
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Total Complaints */}
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
            {(() => {
              const { text, value } = report("");
              return renderBadge(value, text);
            })()}
          </div>
        </div>

        {/* Completed Complaints */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <CircleCheckBig className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Resolved Complaints
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {complaints.filter((c) => c.status === "Resolved").length}
              </h4>
            </div>
            {(() => {
              const { text, value } = report("Resolved");
              return renderBadge(value, text);
            })()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* Rejected Complaints */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <Pickaxe className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                In Process Complaints
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {complaints.filter((c) => c.status === "In Process").length}
              </h4>
            </div>
            {(() => {
              const { text, value } = report("In Process");
              return renderBadge(value, text);
            })()}
          </div>
        </div>

        {/* Pending Complaints */}
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
                {complaints.filter((c) => c.status === "Pending").length}
              </h4>
            </div>
            {(() => {
              const { text, value } = report("Pending");
              return renderBadge(value, text);
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
