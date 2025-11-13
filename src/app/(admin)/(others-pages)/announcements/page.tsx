"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { useEffect, useState } from "react";

type Announcement = {
  id: number;
  title: string;
  message: string;
  created_by: string;
  createdAt: string;
  creator: {
    image: string;
    name: string;
    email: string;
  };
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
        creator: {
          image: saved?.creator?.image ?? "",
          name: saved?.creator?.name ?? "",
          email: saved?.creator?.email ?? "",
        },
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
                <ScrollArea className="max-h-[28rem] pr-2">
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="p-4 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="flex items-start gap-4">
                          <Image
                            src={ann.creator.image || "/avatar-placeholder.png"}
                            alt={ann.creator.name || "User"}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className=" text-gray-800 dark:text-gray-100">
                                {ann.creator?.name || ann.created_by}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                {(() => {
                                  const created = new Date(ann.createdAt);
                                  const now = new Date();
                                  const diffMs = now.getTime() - created.getTime();
                                  const diffMins = Math.floor(diffMs / 60000);
                                  const diffHrs = Math.floor(diffMins / 60);
                                  if (diffMins < 1) return "Just now";
                                  if (diffMins < 60) return `${diffMins} min ago`;
                                  return `${diffHrs} hr ago`;
                                })()}
                              </span>
                            </div>
                            <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-50 capitalize">{ann.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap capitalize">{ann.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

          </div>
        </ComponentCard>

      </div>
    </div>
  );
}
