"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
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
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      console.log("Sending update request with:", {
        token,
        body: {
          email: formData.email,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        },
      });

      const response = await fetch(
        "https://food-delivery-back-end-three.vercel.app/auth/update-user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            phoneNumber: formData.phoneNumber,
          }),
        }
      );

      const data = await response.json();
      console.log("Response from server:", { status: response.status, data });

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }

      const updatedUser: User = {
        _id: data.updatedUser._id,
        email: data.updatedUser.email,
        name: data.updatedUser.name,
        phoneNumber: data.updatedUser.phoneNumber,
        createdAt: data.updatedUser.createdAt,
        profilePicture: data.updatedUser.profilePicture,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
      setError("Profile updated successfully");
    } catch (error) {
      console.error("Update error details:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Network error occurred. Please try again later."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePicture = async () => {
    if (
      !window.confirm("Are you sure you want to delete your profile picture?")
    )
      return;

    setIsUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://food-delivery-back-end-three.vercel.app/auth/delete-profile-picture",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, profilePicture: undefined };
        setUser(updatedUser as User);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setError("Profile picture removed successfully");
      } else {
        setError(data.message || "Failed to delete profile picture");
      }
    } catch (error) {
      setError("Failed to delete picture. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(
        "https://food-delivery-back-end-three.vercel.app/auth/update-profile-picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, profilePicture: data.profilePictureUrl };
        setUser(updatedUser as User);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setError("Profile picture updated successfully");
      } else {
        setError(data.message || "Failed to update profile picture");
      }
    } catch (error) {
      setError("Failed to upload picture. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const backDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 relative">
        {/* Back Button */}
        <button
          onClick={backDashboard}
          className="absolute top-4 left-4 h-10 w-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {isLoading ? (
          <p className="text-lg text-gray-300 text-center animate-pulse">
            Loading user data...
          </p>
        ) : user ? (
          <div className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-orange-400 font-bold shadow-md">
                    {(user?.name?.charAt(0) ?? "?").toUpperCase()}
                  </div>
                )}
                {editing && (
                  <div className="absolute bottom-0 right-0 flex gap-2">
                    <button
                      onClick={() =>
                        document.getElementById("profile-pic-upload")?.click()
                      }
                      className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-all shadow-md"
                      disabled={isUpdating}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleDeletePicture}
                      className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-md"
                      disabled={isUpdating}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePictureUpload}
                  disabled={isUpdating}
                />
              </div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
            </div>

            {editing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700/50 text-white rounded-lg border-2 ${
                    error && !formData.name
                      ? "border-red-500"
                      : "border-gray-600 focus:border-orange-500"
                  } focus:outline-none transition-all duration-200`}
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700/50 text-white rounded-lg border-2 ${
                    error && !formData.email
                      ? "border-red-500"
                      : "border-gray-600 focus:border-orange-500"
                  } focus:outline-none transition-all duration-200`}
                  placeholder="Enter your email"
                  disabled={isUpdating}
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700/50 text-white rounded-lg border-2 ${
                    error && !formData.phoneNumber
                      ? "border-red-500"
                      : "border-gray-600 focus:border-orange-500"
                  } focus:outline-none transition-all duration-200`}
                  placeholder="Enter your phone number"
                  disabled={isUpdating}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 p-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all disabled:bg-orange-300 text-white font-medium shadow-md"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 p-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all disabled:bg-gray-400 text-white font-medium shadow-md"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-orange-400">Name:</span>{" "}
                    {user.name || "Not set"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-orange-400">Email:</span>{" "}
                    {user.email}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-orange-400">Phone:</span>{" "}
                    {user.phoneNumber || "Not set"}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-orange-400">
                      User ID:
                    </span>{" "}
                    {user._id}
                  </p>
                  {user.createdAt && (
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-orange-400">
                        Joined:
                      </span>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleEditToggle}
                  className="w-full p-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all text-white font-medium shadow-md hover:shadow-orange-500/30"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-lg text-gray-300 text-center">
            No user data available.
          </p>
        )}

        {error && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              error.includes("successfully") ? "text-green-400" : "text-red-400"
            }`}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleLogout}
          className="w-full mt-6 p-3 bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:bg-red-400 text-white font-medium shadow-md hover:shadow-red-500/30"
          disabled={isUpdating}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
