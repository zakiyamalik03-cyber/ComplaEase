"use client"
import React from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";
import { ComplaintTableItem } from "@/types/global";
import { useUser } from "@/hooks/useUser";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";



interface ComplaintsTableProps {
  complaints: ComplaintTableItem[];
}

export default function ComplaintsTable({ complaints }: ComplaintsTableProps) {
  const { userData } = useUser();
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300"
                >
                  Subject
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300"
                >
                  Priority
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-300"
                >
                  Date
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Link href={`/complaints/${complaint.complaint_id}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={complaint.user?.image || "/images/user/user-02.jpg"}
                            alt={complaint.user?.name || "user-name"}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-gray-100">
                            {complaint.user?.name || "user-name"}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {complaint.user?.email || "user-email"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-300">
                    {complaint.subject}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-300">
                    {userData?.role === "administrator" || userData?.role === "manager" ? (
                      <Select
                        options={[
                          { value: "Pending", label: "Pending" },
                          { value: "In Process", label: "In Process" },
                          { value: "Resolved", label: "Resolved" },
                        ]}
                        value={complaint.status}
                        onChange={(value) => setComplaintStatus(value)}
                      />
                    ) : (
                      <span className="whitespace-nowrap">{complaint.assignedTo}</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-300">
                    <Badge
                      size="sm"
                      color={
                        complaint.priority === "High"
                          ? "error"
                          : complaint.priority === "Medium"
                            ? "warning"
                            : "success"
                      }
                    >
                      {complaint.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-300">
                    {complaint.category}
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-300">
                    <Badge
                      size="sm"
                      color={
                        complaint.status === "Pending"
                          ? "warning"
                          : complaint.status === "In Process"
                            ? "primary"
                            : complaint.status === "Resolved"
                              ? "success"
                              : "error"
                      }
                    >
                      <span className="whitespace-nowrap">{complaint.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-300">
                    {complaint.created_at}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
