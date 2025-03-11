"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Define the shape of the user object
interface User {
  _id: string;
  email: string;
}

export default function Hello() {
  const [user, setUser] = useState<User | null>(null); // Explicitly type user
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      fetch(`http://localhost:5000/auth/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
          return res.json();
        })
        .then((data) => setUser(data))
        .catch((err) => setError(err.message));
    }
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Hello! Login Successful!</h1>
        {user ? (
          <div>
            <p className="text-lg">Welcome, {user.email}!</p>
            <p className="text-sm text-gray-400">User ID: {user._id}</p>
          </div>
        ) : (
          <p className="text-lg">Loading user data...</p>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
