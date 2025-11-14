"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ComplaintTableItem, Status } from "@/types/global";
import { useEffect, useState } from "react";

const statusColors: Record<Status, string> = {
  Pending: "bg-red-100/50 border-red-300 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
  "In Process": "bg-yellow-100/50 border-yellow-300 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200",
  Resolved: "bg-green-100/50 border-green-300 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
  Completed: "bg-gray-100/50 border-gray-300 text-gray-800 dark:bg-gray-800/50 dark:border-gray-600 dark:text-gray-200",
  Rejected: "bg-orange-100/50 border-orange-300 text-orange-800 dark:bg-orange-900/50 dark:border-orange-700 dark:text-orange-200",
};

const priorityColors = {
  Low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "yr ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";

  interval = seconds / 604800;
  if (interval > 1) return Math.floor(interval) + "wk ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "hr ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "min ago";

  return "just now";
}

export default function Progress() {
  const [complaints, setComplaints] = useState<ComplaintTableItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState<Partial<ComplaintTableItem>>({
    subject: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    category: "",
  });

  useEffect(() => {
    async function fetchComplaints() {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");

      try {
        const res = await fetch(`${baseUrl}/api/complaint/getComplaints`, {
          cache: "no-store",
        });
        const result = await res.json();
        const complaintData: ComplaintTableItem[] = result?.data || [];
        setComplaints(complaintData);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      }
    }

    fetchComplaints();
  }, []);

  // Subscribe to real-time complaint updates via SSE
  useEffect(() => {
    const es = new EventSource("/api/complaint/updates");

    es.onmessage = (event) => {
      try {
        const update = JSON.parse(event.data);
        const updateId = String(update?.id ?? "");
        const displayStatus = update?.displayStatus as Status | undefined;
        if (!updateId || !displayStatus) return;

        setComplaints((prev) =>
          prev.map((c) => (String(c.id) === updateId ? { ...c, status: displayStatus } : c))
        );
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      es.close();
    };
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", String(id));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");

    // Capture previous status for rollback on failure
    const previousStatus = complaints.find((c) => String(c.id) === id)?.status;

    // Optimistically update UI
    setComplaints((prev) => prev.map((c) => (String(c.id) === id ? { ...c, status: newStatus } : c)));

    // Persist change to backend
    (async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

      try {
        const res = await fetch(`${baseUrl}/api/complaint/update-status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus }),
        });

        if (!res.ok) {
          throw new Error(`Status update failed: ${res.status}`);
        }
      } catch (error) {
        console.error("Failed to update complaint status:", error);
        // Rollback UI change if request failed
        if (previousStatus) {
          setComplaints((prev) => prev.map((c) => (String(c.id) === id ? { ...c, status: previousStatus } : c)));
        }
      }
    })();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddComplaint = () => {
    if (newComplaint.subject && newComplaint.description && newComplaint.assignedTo) {
      const complaint: ComplaintTableItem = {
        id: Date.now(),
        complaint_id: String(Date.now()),
        subject: newComplaint.subject,
        description: newComplaint.description,
        status: "Pending",
        assignedTo: newComplaint.assignedTo,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        priority: newComplaint.priority || "Medium",
        category: newComplaint.category || "",
        image: newComplaint.user?.image || "",
        created_by: newComplaint.created_by || "no",
        user: {
          image: "",
          name: "",
          role: "",
          department: "",
          email: "",
        },
      };

      setComplaints([...complaints, complaint]);
      setNewComplaint({
        subject: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        category: "",
      });
      setShowAddModal(false);
    }
  };

  const columns: Status[] = ["Pending", "In Process", "Resolved", "Rejected"];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <PageBreadcrumb pageTitle="Complaint Progress" />

      {/* Enhanced Header with Search and Filters */}
      <div className=" mt-6">
        <ComponentCard title="Complaint Reports">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {columns.map((status) => {
              const count = complaints.filter((c) => c.status === status).length;
              return (
                <div key={status} className={`p-4 rounded-lg ${statusColors[status]} border`}>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm">{status}</div>
                </div>
              );
            })}
          </div>
        </ComponentCard>
      </div>

      {/* Kanban Board */}
      <div className="space-y-6 mt-6">
        <ComponentCard title="Kanban Board">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((status) => (
              <div
                key={status}
                onDrop={(e) => handleDrop(e, status)}
                onDragOver={handleDragOver}
                className={`rounded-xl border-2 border-dashed p-4 min-h-96 ${statusColors[status]} transition-all hover:border-solid`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">{status}</h2>
                  <span className="bg-white/20 dark:bg-black/20 px-2 py-1 rounded-full text-xs">
                    {complaints.filter((c) => c.status === status).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {complaints
                    .filter((c) => c.status === status)
                    .map((c) => (
                      <div
                        key={c.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, String(c.id))}
                        className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 cursor-move hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {c.subject}
                          </h3>
                          {c.priority && (
                            <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[c.priority as keyof typeof priorityColors]}`}>
                              {c.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {c.description}
                        </p>
                        {c.category && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {c.category}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <span>{timeAgo(c.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{c.assignedTo || "Unassigned"}</span>
                          </div>
                        </div>
                        {c.user.name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {c.user.name} <span className="mx-2">|</span> {c.user.department}

                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ComponentCard>
      </div>

      {/* Add Complaint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Add New Complaint
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newComplaint.subject}
                onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <textarea
                placeholder="Description"
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-24 resize-none"
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={newComplaint.assignedTo}
                onChange={(e) => setNewComplaint({ ...newComplaint, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Category"
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value as "Low" | "Medium" | "High" })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddComplaint}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Complaint
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
