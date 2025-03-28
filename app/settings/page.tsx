"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h1 className="text-4xl font-bold text-orange-400 mb-6">Settings</h1>
          <p className="text-lg text-gray-200">Hello Settings!</p>
          {/* Add more settings content here as needed */}
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-300">
                Account Settings
              </h2>
              <p className="text-gray-400">
                Manage your account preferences here.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-300">
                Notifications
              </h2>
              <p className="text-gray-400">
                Configure your notification settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
