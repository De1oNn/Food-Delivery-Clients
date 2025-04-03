"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await axios.get<{ restaurant: Restaurant }>(
          `https://food-delivery-back-end-three.vercel.app/restaurant/${id}`
        );
        setRestaurant(res.data.restaurant);
      } catch (error: any) {
        console.error("Error fetching restaurant:", error);
        setError(
          error.response?.data?.message || "Failed to load restaurant details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurant();
    }
  }, [id]);

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

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
            <p className="text-gray-400 animate-pulse text-xl">
              Loading restaurant details...
            </p>
          </div>
        ) : error ? (
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : restaurant ? (
          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <div className="relative">
              <img
                src={restaurant.picture || "/fallback-image.jpg"}
                alt={restaurant.name}
                className="w-full h-[400px] object-cover rounded-lg mb-6"
                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
              />
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            </div>

            <h1 className="text-4xl font-bold text-orange-400 mb-4">
              {restaurant.name}
            </h1>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold">Location:</span>
                <p className="text-lg text-gray-200">{restaurant.location}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold">Phone:</span>
                <p className="text-lg text-gray-200">
                  {restaurant.phoneNumber}
                </p>
              </div>

              <div>
                <span className="text-gray-400 font-semibold">About:</span>
                <p className="text-lg text-gray-200 mt-1">
                  {restaurant.information}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold">
                  Established:
                </span>
                <p className="text-lg text-gray-200">
                  {new Date(restaurant.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg text-center">
            <p className="text-gray-400 text-lg">Restaurant not found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
