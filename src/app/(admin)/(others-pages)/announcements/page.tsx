"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

type Announcement = {
  id: number;
  title: string;
  message: string;
  created_by: string;
  createdAt: string;
};

// Minimal UI components built from scratch using Tailwind only

const Button = ({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...rest}
    className={`px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  >
    {children}
  </button>
);

const ScrollArea = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`overflow-y-auto ${className}`}>{children}</div>
);

export default function AnnouncementPage() {
  const { userData } = useUser();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Fetch announcements on mount
  useEffect(() => {
    let cancelled = false;
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/admin/announcements", {
          headers: { "Connection": "keep-alive" },
        });
        if (!res.ok) throw new Error("Failed to fetch announcements");
        const data: Announcement[] = await res.json();
        if (!cancelled) setAnnouncements(data);
      } catch (err) {
        if (!cancelled) console.error(err);
      }
    }
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      const res = await fetch('/api/admin/announcements/postAnnouncement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), message: message.trim(), created_by: userData?.id || "" }),
      });

      if (!res.ok) throw new Error('Failed to post announcement');

      const saved = await res.json();

      const newAnnouncement: Announcement = {
        id: saved.id,
        title: saved.title,
        message: saved.message,
        created_by: saved.created_by,
        createdAt: saved.createdAt,
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
      // Optionally show user-facing error notification here
    }
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Announcements" />
      <div className="space-y-6">
        <ComponentCard title="Announcements">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Send Announcement Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter announcement title"
                  className="dark:bg-white/[0.03] dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
                  Message
                </Label>
                <TextArea
                  value={message}
                  onChange={(val) => setMessage(val)}
                  rows={6}
                  placeholder="Write your announcement here..."
                  className="dark:bg-white/[0.03] dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <Button
                className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600"
              >
                Send Announcement
              </Button>
            </form>


            {/* Right: Previously Sent Announcements */}
            <div>

              {announcements.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-4 border rounded-md dark:border-gray-700">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{ann.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{ann.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">By: {ann.created_by} • {ann.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </ComponentCard>

      </div>
    </div>
  );
}
