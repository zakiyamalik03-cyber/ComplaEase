"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useState } from "react";

type Announcement = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

// Minimal UI components built from scratch using Tailwind only
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">{children}</div>
);

const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-800 dark:text-gray-100 ${className}`}>{children}</h3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

const Label = ({ children, htmlFor, className = "" }: { children: React.ReactNode; htmlFor?: string; className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`}>
    {children}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className || ""}`}
  />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-white/[0.03] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className || ""}`}
  />
);

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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 1,
      title: "System Maintenance",
      body: "The system will be under maintenance tonight from 10 PM to 12 AM.",
      createdAt: "2024-05-01 21:00",
    },
    {
      id: 2,
      title: "Holiday Notice",
      body: "Offices will remain closed on Monday for the public holiday.",
      createdAt: "2024-04-28 09:30",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toLocaleString(),
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setBody("");
  };

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Announcements" />
      <div className="space-y-6">
        <ComponentCard title="Announcements"><div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Send Announcement Form */}
        <Card className="dark:bg-gray-900 dark:border-gray-700 h-fit">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">
              Send Announcement
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  required
                  className="dark:bg-white/[0.03] dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="body" className="text-gray-700 dark:text-gray-300">
                  Body
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  placeholder="Write your announcement here..."
                  required
                  className="dark:bg-white/[0.03] dark:border-gray-600 dark:text-gray-100"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-700 dark:hover:bg-brand-600"
              >
                Send Announcement
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right: Previously Sent Announcements */}
        <Card className="dark:bg-gray-900 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-800 dark:text-gray-100">
              Previous Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {announcements.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <Card
                      key={ann.id}
                      className="dark:bg-white/[0.03] dark:border-gray-700 hover:bg-brand-50/20"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base text-gray-800 dark:text-gray-100">
                            {ann.title}
                          </CardTitle>
                          <span className="text-xs text-brand-500">
                            {ann.createdAt}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {ann.body}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      </ComponentCard>

      </div>
    </div>
  );
}
