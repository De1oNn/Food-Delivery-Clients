"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt?: string;
  profilePicture?: string;
}

export default function profile() {
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
      const handleDeletePicture = async () => {
        if (
          !window.confirm(
            "Are you sure you want to delete your profile picture?"
          )
        )
          return;

        setIsUpdating(true);
        setError("");

        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/auth/delete-profile-picture", {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

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

          const response = await fetch("/auth/update-profile-picture", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const data = await response.json();
          if (response.ok) {
            const updatedUser = {
              ...user,
              profilePicture: data.profilePictureUrl,
            };
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
        router.push("/dashboard")
      }
    
    return (
      <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-lg">
        <button
          className="bg-[black] h-[40px] w-[40px] rounded-2xl text-[white] flex justify-center items-center"
          onClick={backDashboard}
        >
          x
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
                {/* Display profile picture or default avatar */}
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-2xl text-gray-300 font-bold">
                    {(user?.name?.charAt(0) ?? "?").toUpperCase()}
                  </div>
                )}
                {editing && (
                  <div className="absolute bottom-0 right-0 flex gap-1">
                    <button
                      onClick={() =>
                        document.getElementById("profile-pic-upload")?.click()
                      }
                      className="p-1 bg-blue-600 rounded-full hover:bg-blue-700 transition-all"
                      disabled={isUpdating}
                    >
                      <svg
                        className="w-5 h-5 text-white"
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
                      className="p-1 bg-red-600 rounded-full hover:bg-red-700 transition-all"
                      disabled={isUpdating}
                    >
                      <svg
                        className="w-5 h-5 text-white"
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
            </div>

            {editing ? (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`p-3 bg-gray-700 text-white rounded-lg border-2 ${
                    error && !formData.name
                      ? "border-red-500"
                      : "border-gray-600 focus:border-blue-500"
                  } focus:outline-none transition-colors duration-200`}
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`p-3 bg-gray-700 text-white rounded-lg border-2 ${
                    error && !formData.name
                      ? "border-red-500"
                      : "border-gray-600 focus:border-blue-500"
                  } focus:outline-none transition-colors duration-200`}
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`p-3 bg-gray-700 text-white rounded-lg border-2 ${
                    error && !formData.name
                      ? "border-red-500"
                      : "border-gray-600 focus:border-blue-500"
                  } focus:outline-none transition-colors duration-200`}
                  placeholder="Enter your name"
                  disabled={isUpdating}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 text-white font-medium"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex-1 p-3 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all disabled:bg-gray-400 text-white font-medium"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Name:</span> {user.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Phone:</span>{" "}
                    {user.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">User ID:</span> {user._id}
                  </p>
                  {user.createdAt && (
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Joined:</span>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleEditToggle}
                  className="w-full p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-all text-white font-medium"
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
          className="w-full mt-6 p-3 bg-red-600 rounded-lg hover:bg-red-700 transition-all disabled:bg-red-400 text-white font-medium"
          disabled={isUpdating}
        >
          Logout
        </button>
      </div>
    );
}