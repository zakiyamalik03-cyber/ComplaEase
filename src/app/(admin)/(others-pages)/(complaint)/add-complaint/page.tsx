"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";


export default function AddComplaintPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const category = [
        { value: "academic", label: "Academic" },
        { value: "facilities", label: "Facilities" },
        { value: "finance", label: "Finance" },
        { value: "hostel", label: "Hostel" },
        { value: "transport", label: "Transport" },
        { value: "technical", label: "Technical" },
        { value: "billing", label: "Billing" },
        { value: "service", label: "Service" },
        { value: "administrative", label: "Administrative" },
        { value: "product", label: "Product" },
        { value: "other", label: "Other" }, 
    ];
    const priority = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
    ]
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!title.trim() || !description.trim() || !category) {
            alert("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            alert("Complaint added successfully!");
            router.push("/post-complaint");
        }, 1000);
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <PageBreadcrumb pageTitle="Add New Complaint" />
            <div className="space-y-6">
                <ComponentCard title="Kanban View">

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="Brief title of the complaint"
                                defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description *</Label>
                            <TextArea

                                placeholder="Detailed description of the issue"
                                rows={5}
                                value={description}
                                onChange={(value: string) => setDescription(value)}

                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                options={category}
                                placeholder="Select Option"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                options={priority}
                                placeholder="Select Option"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />

                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Button disabled={loading}>
                                {loading ? "Submitting..." : "Submit Complaint"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </ComponentCard>

            </div>
        </div>
    );
}
