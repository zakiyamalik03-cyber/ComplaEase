"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Alert from "@/components/ui/alert/Alert";
import { useUser } from "@/hooks/useUser";

export default function AddComplaintPage() {
    const router = useRouter();
    const { userData } = useUser();
    const [created_by, setCreatedBy] = useState("");
    const [complaintTypes, setComplaintTypes] = useState<{ value: string; label: string }[]>([]);
    const [complaint_type_id, setComplaintTypeId] = useState("");
    const [priority, setPriority] = useState("Auto");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userData?.id) {
            setCreatedBy(userData.id);
            setStatus("pending");
        }
    }, [userData]);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res = await fetch("/api/complaint-types");
                const json = await res.json();
                if (json.success) {
                    setComplaintTypes(json.data.map((t: any) => ({ value: String(t.id), label: t.name })));
                }
            } catch (err) {
                console.error("Failed to fetch complaint types:", err);
            }
        };
        fetchTypes();
    }, []);

    const priorityOptions = [
        { value: "Auto", label: "Auto (AI Recommended)" },
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "High", label: "High" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        // Basic validation
        if (!title.trim() || !description.trim() || !complaint_type_id) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const payload = {
            title,
            complaint_type_id: Number(complaint_type_id),
            priority,
            description,
            status,
            created_by: Number(created_by)
        };

        try {
            const res = await fetch("/api/complaint/add-complaint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let message = res.statusText;
                try {
                    const data = await res.json();
                    if (data.error) message = data.error;
                } catch { }
                throw new Error(message || "Failed to post complaint");
            }

            // Reset form state
            setTitle("");
            setComplaintTypeId("");
            setPriority("Auto");
            setDescription("");
            setStatus("pending");
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <PageBreadcrumb pageTitle="Add New Complaint" />
            <div className="space-y-6">
                <ComponentCard title="Complaint Form">
                    {error && (
                        <Alert
                            variant="error"
                            title="Error"
                            message={error}
                            showLink={false}
                            linkHref=""
                            linkText=""
                        />
                    )}
                    {success && (
                        <Alert
                            variant="success"
                            title="Complaint Submitted"
                            message="Your complaint has been successfully submitted."
                            showLink={true}
                            linkHref="/complaints"
                            linkText="Go to Complaints"
                        />
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="Brief title of the complaint"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                options={complaintTypes}
                                placeholder="Select Category"
                                defaultValue={complaint_type_id}
                                onChange={(val) => setComplaintTypeId(val)}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                options={priorityOptions}
                                placeholder="Select Priority"
                                defaultValue={priority}
                                onChange={(val) => setPriority(val)}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <TextArea
                                placeholder="Detailed description of the issue"
                                rows={5}
                                value={description}
                                onChange={(value) => setDescription(value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Button disabled={loading}>
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </Button>
                            <Button variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </ComponentCard>
            </div>
        </div>
    );
}
