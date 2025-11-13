"use client";
import { UserData } from '@/types/global';
import { useState, useEffect } from 'react';

export function useUser() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await fetch("/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
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
    };
    
    fetchUserData();
  }, []);

  return { userData, loading, error };
}