"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!email || !password || !name || !phoneNumber) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user data
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please check your backend server.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
        <div className="absolute -top-2 left-2 w-full h-full bg-white/10 rounded-3xl shadow-lg blur-md pointer-events-none"></div>
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-300 transition-all duration-200 z-10"
          disabled={isLoading}
        >
          X
        </button>

        <h1 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-md">
          Create Account
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
          className="space-y-6"
        >
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full p-3 rounded-xl bg-gray-800/50 text-white shadow-inner border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full p-3 rounded-xl bg-gray-800/50 text-white shadow-inner border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full p-3 rounded-xl bg-gray-800/50 text-white shadow-inner border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2 block w-full p-3 rounded-xl bg-gray-800/50 text-white shadow-inner border border-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transform transition-all duration-300 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "active:scale-95 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-purple-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </div>
    </div>
  );
}