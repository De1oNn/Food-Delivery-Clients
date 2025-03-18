"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ShoppingCart } from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setError("Please log in to continue");
        router.push("/login");
        return;
      }

      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            phoneNumber: parsedUser.phoneNumber || "",
          });
        } catch (err) {
          setError("Invalid user data. Please log in again.");
          router.push("/login");
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleEditToggle = () => {
    setEditing(!editing);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
      setError("Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateToProfile = () => router.push("/dashboard/profile");
  const navigateToOrder = () => router.push("/order");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white grid grid-cols-[100px_1fr] gap-4 p-4">
      <div className="h-screen w-[100px] bg-red-500 row-span-2" />

      <header className="bg-yellow-500 flex justify-end items-center pr-4">
        <div className="flex items-center gap-4">
          <Bell className="hover:text-[#EA6A12] cursor-pointer" />
          <ShoppingCart className="cursor-pointer" />
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={navigateToProfile}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span>{user?.name || "User"}</span>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            Food<u className="text-green-500">Board</u>
          </h1>
          <button
            onClick={navigateToOrder}
            className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Order Now
          </button>
        </div>

        <section className="p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>

          {user ? (
            editing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  disabled={isUpdating}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                  disabled={isUpdating}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 p-2 bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="flex-1 p-2 bg-gray-500 rounded hover:bg-gray-600 disabled:bg-gray-300"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-lg">Welcome, {user.name}!</p>
                <p className="text-sm text-gray-400">Email: {user.email}</p>
                <p className="text-sm text-gray-400">
                  Phone: {user.phoneNumber}
                </p>
                {user.createdAt && (
                  <p className="text-sm text-gray-400">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={handleEditToggle}
                  className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                >
                  Edit Profile
                </button>
              </div>
            )
          ) : (
            <p className="text-lg">No user data available</p>
          )}

          {error && (
            <p
              className={`mt-4 ${
                error.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
