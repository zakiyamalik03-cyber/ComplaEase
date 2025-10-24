import React from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";


interface Complaint {
  id: number;
  student: {
    image: string;
    name: string;
    regNo: string;
  };
  title: string;
  category: string;
  status: string;
  submittedAt: string;
}

// Define the table data using the interface
const tableData: Complaint[] = [
  {
    id: 1,
    student: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      regNo: "FA21-BCS-001",
    },
    title: "Hostel Wi-Fi Issue",
    category: "Infrastructure",
    status: "Resolved",
    submittedAt: "2024-06-12",
  },
  {
    id: 2,
    student: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      regNo: "FA21-BCS-042",
    },
    title: "Course Registration Problem",
    category: "Academic",
    status: "Pending",
    submittedAt: "2024-06-10",
  },
  {
    id: 3,
    student: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      regNo: "SP22-BBA-015",
    },
    title: "Cafeteria Hygiene",
    category: "Facilities",
    status: "In Progress",
    submittedAt: "2024-06-08",
  },
  {
    id: 4,
    student: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      regNo: "FA20-EEE-110",
    },
    title: "Bus Schedule Conflict",
    category: "Transport",
    status: "Resolved",
    submittedAt: "2024-06-05",
  },
  {
    id: 5,
    student: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      regNo: "SP21-MCE-067",
    },
    title: "Library Book Availability",
    category: "Academic",
    status: "Pending",
    submittedAt: "2024-06-01",
  },
];

export default function StudentsTable() {
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
                  Student
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Complaint Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Submitted At
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {tableData.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={complaint.student.image}
                          alt={complaint.student.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {complaint.student.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {complaint.student.regNo}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {complaint.title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {complaint.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        complaint.status === "Resolved"
                          ? "success"
                          : complaint.status === "Pending"
                          ? "warning"
                          : "primary"
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {complaint.submittedAt}
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
