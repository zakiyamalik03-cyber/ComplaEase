"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect, useState } from "react";

type Status = "Open" | "In Progress" | "Resolved" | "Closed";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignedTo: string;
  createdAt: string;
}

const statusColors: Record<Status, string> = {
  Open: "bg-red-100/50 border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
  "In Progress": "bg-yellow-100/50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200",
  Resolved: "bg-green-100/50 border-green-300 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
  Closed: "bg-gray-100/50 border-gray-300 text-gray-800 dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-200",
};

export default function Progress() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Dummy data – replace with real fetch
    setComplaints([
      {
        id: "1",
        title: "Broken AC",
        description: "AC not working in room 301",
        status: "Open",
        assignedTo: "John Doe",
        createdAt: "2024-06-01",
      },
      {
        id: "2",
        title: "WiFi Issue",
        description: "No internet connection",
        status: "In Progress",
        assignedTo: "Jane Smith",
        createdAt: "2024-06-02",
      },
      {
        id: "3",
        title: "Leaky Faucet",
        description: "Faucet in kitchen is leaking",
        status: "Resolved",
        assignedTo: "Mike Ross",
        createdAt: "2024-06-03",
      },
      {
        id: "4",
        title: "Light Bulb Out",
        description: "Bulb in hallway needs replacement",
        status: "Closed",
        assignedTo: "Rachel Green",
        createdAt: "2024-06-04",
      },
    ]);
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const columns: Status[] = ["Open", "In Progress", "Resolved", "Closed"];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageBreadcrumb pageTitle="Complaint Progress" />
      <div className="space-y-6">
        <ComponentCard title="Kanban View">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((status) => (
            <div
              key={status}
              onDrop={(e) => handleDrop(e, status)}
              onDragOver={handleDragOver}
              className={`rounded-xl border-2 border-dashed p-4 ${statusColors[status]}`}
            >
              <h2 className="font-semibold text-lg mb-4">{status}</h2>
              <div className="space-y-4">
                {complaints
                  .filter((c) => c.status === status)
                  .map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, c.id)}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 cursor-move"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {c.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{c.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{c.createdAt}</span>
                        <span>Assigned: {c.assignedTo}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        </ComponentCard>
      </div>

    </div>
  );
}
