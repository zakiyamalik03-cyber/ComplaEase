"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useUser } from "@/hooks/useUser";
import { Announcement } from "@/types/global";
import Image from "next/image";
import { useEffect, useState } from "react";

// Minimal UI components built from scratch using Tailwind only

const Button = ({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...rest}
    className={`px-4 py-2 rounded-md font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 ${className}`}
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAnnouncements();
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSubmitting(true);
    setSubmitStatus("idle");

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
      setSubmitStatus("success");
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Announcements" />
      <div className="space-y-6">
        <ComponentCard title="Announcements">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row justify-around gap-8">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Left: Send Announcement Form */}
            {submitStatus === "success" && (
              <Alert variant="success" title="Success" message="Announcement posted successfully!" />
            )}
            {submitStatus === "error" && (
              <Alert variant="error" title="Error" message="Failed to post announcement. Please try again." />
            )}
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
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                    Posting...
                  </>
                ) : (
                  "Post Announcement"
                )}
              </Button>
            </form>

            {/* Right: Previously Sent Announcements */}
            <div className="border border-gray-200 rounded-2xl p-4 dark:border-gray-800 w-full">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">Posted Announcements </h4>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading announcements...</span>
                </div>
              ) : announcements.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
              ) : (
                <ScrollArea className="max-h-[28rem]">
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="border rounded-lg dark:border-gray-700 bg-white dark:bg-white/5">
                        <DropdownItem
                          className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                        >
                          <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                            <Image
                              width={40}
                              height={40}
                              src={ann.creator.image || "/images/user/user-01.jpg"}
                              alt="User"
                              className="w-full overflow-hidden rounded-full"
                            />
                            <span className="absolute bottom-0 right-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
                          </span>
                          <span className="block">
                            <span className="mb-1.5 capitalize space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                              <span className=" font-medium text-gray-800 dark:text-white/90">
                                {ann.title}
                              </span> | 
                              <span className="ml-1.5 capitalize">{ann.message}</span>
                            </span>
                            <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                              <span>{ann.creator.name}</span>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span>{(() => {
                                const created = new Date(ann.createdAt);
                                const now = new Date();
                                const diffMs = now.getTime() - created.getTime();
                                const diffMins = Math.floor(diffMs / 60000);
                                const diffHrs = Math.floor(diffMins / 60);
                                if (diffMins < 1) return "Just now";
                                if (diffMins < 60) return `${diffMins} min ago`;
                                return `${diffHrs} hr ago`;
                              })()}</span>
                            </span>
                          </span>
                        </DropdownItem>
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
