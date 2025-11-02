"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";

export default function AddStaffPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff",
        department: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to register staff");
            }

            router.push("/admin/users");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const roles = [
        { value: "Student", label: "Student" },
        { value: "Staff", label: "Staff" },
        { value: "Manager", label: "Manager" },
    ]
    const departments = [
        { value: "Computer Science", label: "Computer Science" },
        { value: "Business Administration", label: "Business Administration" },
        { value: "Electrical Engineering", label: "Electrical Engineering" },
        { value: "Mechanical Engineering", label: "Mechanical Engineering" },
        { value: "Civil Engineering", label: "Civil Engineering" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Physics", label: "Physics" },
        { value: "Chemistry", label: "Chemistry" },
        { value: "Biology", label: "Biology" },
        { value: "English Literature", label: "English Literature" },
    ]
    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };

    return (
        <div className=" bg-gray-50 dark:bg-gray-900">
            <PageBreadcrumb pageTitle="Add Staff" />
            <div className="space-y-6">
                <ComponentCard title="Add Staff">

                    {error && <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</Label>
                            <Input
                                name="name"
                                type="text"

                                defaultValue={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</Label>
                            <Input
                                name="email"
                                type="email"

                                defaultValue={form.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                defaultValue={form.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone Number</Label>
                            <Input
                                name="phone"
                                type="tel"

                                defaultValue={form.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</Label>
                            <Select
                                options={departments}
                                placeholder="Select Option"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</Label>
                            <Select
                                options={roles}
                                placeholder="Select Option"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={loading}>
                                {loading ? "Submitting..." : "Add Staff"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form></ComponentCard></div>
        </div>
    );
}
