"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Define the shape of the user object
interface User {
  _id: string;
  email: string;
}

export default function Dashboard() {
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
    <div className="min-h-screen bg-gray-900 text-white grid grid-cols-[100px_1fr] grid-rows-[100px_1fr] gap-4 p-4">
      {/* Red div - full height on left */}
      <div className="h-screen w-[100px] bg-red-500 row-span-2"></div>

      {/* Yellow div - top beside red */}
      <div className="w-full h-[100px] bg-yellow-500"></div>

      {/* Content area - beside red and below yellow */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            Food<u className="text-green-500">Board</u>
          </h1>
          <div className="h-[1px] w-20 bg-white mx-auto mt-2"></div>
        </div>

        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
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
    </div>
  );
}
