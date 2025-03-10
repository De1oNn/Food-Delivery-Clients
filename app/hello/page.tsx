"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Hello() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Get userId from query string

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/auth/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch((err) => setError(err.message));
    }
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Hello! Signup Successful!</h1>
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
