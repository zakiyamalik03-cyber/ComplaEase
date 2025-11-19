"use client"
import React, { useEffect, useMemo, useState } from "react";
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
  const [rows, setRows] = useState<ComplaintTableItem[]>(complaints);
  const [usersOptions, setUsersOptions] = useState<{ value: string; label: string }[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const isAdminManager = (userData?.role || "").toLowerCase() === "administrator" || (userData?.role || "").toLowerCase() === "manager" || (userData?.role || "").toLowerCase() === "admin";

  const baseUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL as string;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  }, []);

  useEffect(() => {
    setRows(complaints);
  }, [complaints]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/users/getUsers`, { cache: "no-store" });
        const json = await res.json();
        const list = (json?.data || []).map((u: any) => ({ value: String(u.id), label: String(u.name || u.email || u.id) }));
        const map: Record<string, string> = {};
        for (const u of json?.data || []) {
          const idStr = String(u.id);
          const nameStr = String(u.name || u.email || u.id);
          map[idStr] = nameStr;
        }
        setUsersMap(map);
        if (isAdminManager) {
          setUsersOptions([{ value: "", label: "Select user" }, ...list]);
        }
      } catch (e) {
        console.error("Failed to fetch users:", e);
      }
    };
    fetchUsers();
  }, [baseUrl, isAdminManager]);

  useEffect(() => {
    const es = new EventSource(`${baseUrl}/api/complaint/updates`);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        const { id, status, displayStatus, assigned_to } = data || {};
        if (id) {
          setRows((prev) =>
            prev.map((r) =>
              r.id === Number(id)
                ? {
                    ...r,
                    status: displayStatus || (typeof status === "string" ? (status === "in_process" ? "In Process" : status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())) : r.status),
                    assignedTo: assigned_to !== undefined && assigned_to !== null ? String(assigned_to) : r.assignedTo,
                    updated_at: new Date().toISOString(),
                  }
                : r
            )
          );
        }
      } catch (err) {
        // ignore parse errors
      }
    };
    es.onerror = () => {
      es.close();
    };
    return () => es.close();
  }, [baseUrl]);

  async function handleAssign(id: number, assigned_to: string) {
    try {
      const res = await fetch(`${baseUrl}/api/complaint/update-assignee`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, assigned_to }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        console.error("Failed to assign complaint:", json);
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, assignedTo: assigned_to } : r)));
    } catch (e) {
      console.error("Assign error:", e);
    }
  }

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
                  Assigned To
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
              {rows.map((complaint) => (
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
                    {complaint.description}
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
                    {isAdminManager ? (
                      <Select
                        options={usersOptions}
                        defaultValue={String(complaint.assignedTo || "")}
                        onChange={(value) => handleAssign(complaint.id, value)}
                        placeholder="Assign user"
                      />
                    ) : (
                      <span className="whitespace-nowrap">
                        {complaint.assignedTo
                          ? (usersMap[String(complaint.assignedTo)] ?? String(complaint.assignedTo))
                          : "Not Assigned"}
                      </span>
                    )}
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
