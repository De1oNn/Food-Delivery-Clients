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
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [router]);

  const navigateToProfile = () => router.push("/dashboard/profile");
  const navigateToOrder = () => router.push("/order");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[100px] bg-orange-600 shadow-lg flex flex-col items-center py-6 space-y-8 z-10">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={navigateToProfile}
        >
          <Avatar className="h-12 w-12 ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-800">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {/* <span className="text-lg font-medium group-hover:text-orange-400 transition-colors">
            {user?.name || "User"}
          </span> */}
        </div>
        <Bell className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors" />
        <ShoppingCart className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors" />
      </aside>

      {/* Main Content */}
      <div className="ml-[100px] p-6">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <div className="relative flex items-center w-full max-w-md">
            <input
              placeholder="Search for food..."
              type="search" // Changed from "Search food" to proper type="search"
              className="w-full h-12 px-5 pr-10 bg-gray-700/70 text-white placeholder-gray-400 rounded-full border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
            />
            <svg
              className="absolute right-3 w-5 h-5 text-gray-400 hover:text-orange-500 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-extrabold tracking-tight">
              Food<span className="text-orange-500">Board</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              Order delicious meals from your favorite local restaurants,
              delivered straight to your door.
            </p>
            <button
              onClick={navigateToOrder}
              className="px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
            >
              Order Now
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
