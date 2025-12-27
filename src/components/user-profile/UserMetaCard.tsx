"use client";
import React, { useState, useRef } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { PencilIcon, TrashBinIcon, PlusIcon } from "@/icons";

export default function UserMetaCard() {
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isImageOpen, openModal: openImageModal, closeModal: closeImageModal } = useModal();
  const { userData, loading, refresh } = useUser();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload: Record<string, string> = {};
      if (name !== (userData?.name || "")) payload.name = name;
      if (email !== (userData?.email || "")) payload.email = email;
      if (phone !== (userData?.phone || "")) payload.phone = phone;

      if (Object.keys(payload).length === 0) {
        closeEditModal();
        return;
      }

      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to update profile");
      }

      await refresh();
      closeEditModal();
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/users/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      await refresh();
      closeImageModal();
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!confirm("Are you sure you want to delete your profile picture?")) return;
    try {
      setImageUploading(true);
      const res = await fetch("/api/users/delete-image", {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      await refresh();
      closeImageModal();
    } catch (error) {
      console.error(error);
      alert("Failed to delete image");
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div
              className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 cursor-pointer relative group"
              onClick={openImageModal}
            >
              <Image
                width={80}
                height={80}
                src={userData?.image || "/images/user/male.jpg"}
                alt={userData?.name || "User"}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs">
                Edit
              </div>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {loading ? "Loading..." : (userData?.name || "User")}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData?.role || "User"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userData?.department || "Department"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openEditModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <PencilIcon className="fill-current w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditOpen} onClose={closeEditModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Full Name</Label>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Role</Label>
                    <div className="dark:text-white pt-2">{userData?.role}</div>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeEditModal}>
                Close
              </Button>
              <Button size="sm" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View/Edit Image Modal */}
      <Modal isOpen={isImageOpen} onClose={closeImageModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 flex flex-col items-center">
          <h4 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white/90">
            Profile Photo
          </h4>

          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 mb-8 relative">
            <Image
              width={300}
              height={300}
              src={userData?.image || "/images/user/male.jpg"}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <div className="flex items-center gap-4 w-full justify-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
            >
              <PlusIcon className="w-4 h-4" />
              Upload Photo
            </Button>

            <Button
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border-transparent"
              onClick={handleImageDelete}
              disabled={imageUploading}
            >
              <TrashBinIcon className="w-4 h-4 fill-white" />
              Delete
            </Button>
          </div>

          <div className="mt-6 w-full flex justify-end">
            <Button size="sm" variant="outline" onClick={closeImageModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
