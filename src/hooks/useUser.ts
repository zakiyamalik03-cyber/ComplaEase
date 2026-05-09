"use client";
import { UserData } from '@/types/global';
import { useState, useEffect, useCallback } from 'react';

export function useUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

      const response = await fetch("/api/users/me", {
        // Prefer cookies; include Authorization only if token exists
        headers: token ? { "Authorization": `Bearer ${token}` } : undefined,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setError(null);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      setError("Error fetching user data");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = async (updatedData: Partial<UserData>) => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

      const response = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedData),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error || "Failed to update profile" };
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { userData, loading, error, refresh: fetchUserData, updateUser };
}