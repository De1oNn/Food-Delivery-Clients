"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(0);
    const [foods, setFoods] = useState<Food[]>([]);

  // Left half background images (behind the form)
  const leftBackgroundImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1504672281656-e3e7b0ae83ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1565299624946-baccd305181c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
  ];

  // Right half background images
  const rightBackgroundImages = [
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1511690656952-34372de2f617?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
  ];

  // Auto-swipe for left half
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftImageIndex(
        (prevIndex) => (prevIndex + 1) % leftBackgroundImages.length
      );
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [leftBackgroundImages.length]);

  // Auto-swipe for right half
  useEffect(() => {
    const interval = setInterval(() => {
      setRightImageIndex(
        (prevIndex) => (prevIndex + 1) % rightBackgroundImages.length
      );
    }, 2000); // 2 seconds
    return () => clearInterval(interval);
  }, [rightBackgroundImages.length]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch("http://localhost:5000/food", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.foods)) {
          setFoods(data.foods); // Show all foods
        } else {
          console.error("Failed to fetch foods:", data.message);
          setFoods([]);
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
        setFoods([]);
      }
    };
    fetchFoods();
  }, []);

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
        localStorage.setItem("user", JSON.stringify(data.user));
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Left Half: Form with Slideshow Background */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Left Slideshow */}
        <div className="absolute inset-0">
          {leftBackgroundImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Left Slideshow Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === leftImageIndex ? "opacity-70" : "opacity-0"
              } `}
            />
          ))}
        </div>
        {/* Form Card */}
        <div className="relative z-10 max-w-md w-full bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-700/50">
          <h1 className="text-4xl font-extrabold text-center text-orange-400 mb-6">
            Create Account
          </h1>
          <button
            onClick={handleBack}
            className="absolute top-4 right-4 text-white text-xl font-bold hover:text-orange-400 transition-all duration-200"
            disabled={isLoading}
          >
            X
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="space-y-6"
          >
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2 block w-full p-3 rounded-full bg-gray-700/70 text-white border-2 border-gray-600 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 rounded-full text-white font-semibold bg-orange-500 shadow-lg transform transition-all duration-300 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-orange-600 active:scale-95 hover:shadow-orange-500/30"
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

      {/* Right Half: Slideshow Background */}
      <div className="hidden md:flex flex-1 relative overflow-hidden flex justify-center items-center">
        {/* Right Slideshow */}
        <div className="absolute inset-0">
          {rightBackgroundImages.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Right Slideshow Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === rightImageIndex ? "opacity-70" : "opacity-0"
              } `}
            />
          ))}
        </div>
        {/* <div className="absolute inset-0 bg-gradient-to-l from-gray-900/50 to-transparent" /> */}
        <div className="relative z-10 w-full h-[70vh] flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl font-bold text-orange-400 mb-4 text-center drop-shadow-md">
            Our Menu
          </h2>
          <div className="w-[60vh] flex-1 overflow-y-auto">
            {foods.length > 0 ? (
              <ul className="space-y-4">
                {foods.map((food) => (
                  <li
                    key={food._id}
                    className="flex items-center space-x-3 bg-gray-800/70 p-3 rounded-xl shadow-lg border border-gray-700/30 hover:bg-gray-700/90 hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {food.image && (
                      <div className="flex-shrink-0">
                        <Image
                          src={food.image}
                          alt={food.foodName}
                          width={50}
                          height={50}
                          className="rounded-full object-cover border-2 border-orange-500/50"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-orange-400 truncate">
                        {food.foodName}
                      </h3>
                      <p className="text-gray-400 text-xs truncate">
                        ${food.price.toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center text-sm">
                No menu items available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
