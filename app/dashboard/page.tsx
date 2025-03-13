"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "" });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      setError("No token found. Please log in again.");
      setIsLoading(false);
      router.push("/login");
      return;
    }

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setFormData({ 
          name: parsedUser.name, 
          email: parsedUser.email, 
          phoneNumber: parsedUser.phoneNumber 
        });
      } catch (err) {
        setError("Invalid user data. Please log in again.");
        router.push("/login");
      }
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/log-in");
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setError("");
    setIsUpdating(true);

    if (!formData.name || !formData.email || !formData.phoneNumber) {
      setError("All fields are required");
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/auth/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phoneNumber: formData.phoneNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.updatedUser);
        localStorage.setItem("user", JSON.stringify(data.updatedUser));
        setEditing(false);
        setError("Profile updated successfully");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Network error occurred. Please try again later.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Rest of your JSX remains largely the same, with minor improvements:
  return (
    <div className="min-h-screen bg-gray-900 text-white grid grid-cols-[100px_1fr] grid-rows-[100px_1fr] gap-4 p-4">
      <div className="h-screen w-[100px] bg-red-500 row-span-2"></div>
      <div className="w-full h-[100px] bg-yellow-500 flex justify-end items-center pr-4">
        <button
          onClick={handleLogout}
          className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:bg-red-400"
          disabled={isUpdating}
        >
          Logout
        </button>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            Food<u className="text-green-500">Board</u>
          </h1>
          <div className="h-[1px] w-20 bg-white mx-auto mt-2"></div>
        </div>
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4">Hello! Login Successful!</h1>
          {isLoading ? (
            <p className="text-lg">Loading user data...</p>
          ) : user ? (
            <div>
              {editing ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`p-2 bg-gray-700 text-white rounded ${error && !formData.name ? 'border-red-500 border' : ''}`}
                    placeholder="Enter your name"
                    disabled={isUpdating}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`p-2 bg-gray-700 text-white rounded ${error && !formData.email ? 'border-red-500 border' : ''}`}
                    placeholder="Enter your email"
                    disabled={isUpdating}
                  />
                  <input
                    type="tel" // Changed to tel for better phone number input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`p-2 bg-gray-700 text-white rounded ${error && !formData.phoneNumber ? 'border-red-500 border' : ''}`}
                    placeholder="Enter your phone number"
                    disabled={isUpdating}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 p-2 bg-blue-500 rounded hover:bg-blue-600 transition-all disabled:bg-blue-300"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="flex-1 p-2 bg-gray-500 rounded hover:bg-gray-600 transition-all disabled:bg-gray-300"
                      disabled={isUpdating}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg">Welcome, {user.name}!</p>
                  <p className="text-sm text-gray-400">Email: {user.email}</p>
                  <p className="text-sm text-gray-400">User ID: {user._id}</p>
                  <p className="text-sm text-gray-400">Phone: {user.phoneNumber}</p>
                  {user.createdAt && (
                    <p className="text-sm text-gray-400">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={handleEditToggle}
                    className="mt-4 p-2 bg-green-500 rounded hover:bg-green-600 transition-all"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg">No user data available.</p>
          )}
          {error && (
            <p className={`mt-4 ${error.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}