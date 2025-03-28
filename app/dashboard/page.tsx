"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ShoppingCart, MapPin, Settings } from "lucide-react";
import axios from "axios";

interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt?: string;
}

interface Food {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: { _id: string; categoryName: string } | string;
}

interface SelectedFood {
  food: Food;
  quantity: number;
}

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
}

interface Restaurant {
  _id: string;
  location: string;
  picture: string;
  name: string;
  information: string;
  phoneNumber: number;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] =
    useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantLoading, setRestaurantLoading] = useState<boolean>(false);
  const [restaurantError, setRestaurantError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error parsing user data:", err);
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    if (isRestaurantModalOpen) {
      fetchRestaurants();
    }
  }, [isRestaurantModalOpen]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ foods: Food[] }>(
        "http://localhost:5000/food"
      );
      setFoods(res.data.foods || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    setRestaurantLoading(true);
    setRestaurantError(null);
    try {
      const res = await axios.get<{ restaurants: Restaurant[] }>(
        "http://localhost:5000/restaurant"
      );
      setRestaurants(res.data.restaurants || []);
    } catch (error: any) {
      console.error("Fetch Restaurants Error:", error);
      setRestaurantError(
        error.response?.data?.message || "Failed to load restaurants."
      );
    } finally {
      setRestaurantLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get<{ notifications: Notification[] }>(
        "http://localhost:5000/notif"
      );
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleFoodSelect = (food: Food, quantity: number = 1) => {
    const existingFoodIndex = selectedFoods.findIndex(
      (item) => item.food._id === food._id
    );
    let newSelectedFoods: SelectedFood[];
    if (existingFoodIndex >= 0) {
      newSelectedFoods = selectedFoods.map((item, index) =>
        index === existingFoodIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newSelectedFoods = [...selectedFoods, { food, quantity }];
    }
    newSelectedFoods = newSelectedFoods.filter((item) => item.quantity > 0);
    setSelectedFoods(newSelectedFoods);
    setTotalPrice(
      newSelectedFoods.reduce(
        (sum, item) => sum + item.food.price * item.quantity,
        0
      )
    );
  };

  const handleRemoveFromCart = (foodId: string) => {
    const newSelectedFoods = selectedFoods.filter(
      (item) => item.food._id !== foodId
    );
    setSelectedFoods(newSelectedFoods);
    setTotalPrice(
      newSelectedFoods.reduce(
        (sum, item) => sum + item.food.price * item.quantity,
        0
      )
    );
  };

  const navigateToProfile = () => router.push("/dashboard/profile");
  const navigateToOrder = () => router.push("/order");
  const navigateToRestaurant = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
    setIsRestaurantModalOpen(false);
  };
  const navigateToSettings = () => router.push("/settings");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFoods = foods.filter((food) =>
    food.foodName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </div>
        <div className="relative">
          <Bell
            className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              fetchNotifications();
            }}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>
        <ShoppingCart
          className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
          onClick={() => setIsCartOpen(!isCartOpen)}
        />
        <MapPin
          className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
          onClick={() => setIsRestaurantModalOpen(true)}
        />
        <Settings
          className="h-6 w-6 hover:text-orange-300 cursor-pointer transition-colors"
          onClick={navigateToSettings}
        />
      </aside>

      {/* Main Content */}
      <div className="ml-[100px] p-6">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-lg p-4 flex justify-center items-center mb-6">
          <div className="relative flex items-center w-full max-w-md">
            <input
              placeholder="Search for food..."
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
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
          {loading ? (
            <p className="text-gray-400 animate-pulse">Loading foods...</p>
          ) : searchQuery && filteredFoods.length === 0 ? (
            <p className="text-gray-400">No foods match your search.</p>
          ) : searchQuery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {filteredFoods.map((food) => (
                <div
                  key={food._id}
                  className="bg-gray-800/50 p-4 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <img
                    src={food.image || "/fallback-image.jpg"}
                    alt={food.foodName}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-lg font-medium">{food.foodName}</p>
                  <p className="text-sm text-gray-300">
                    ${food.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {food.ingredients || "No ingredients listed"}
                  </p>
                  <button
                    onClick={() => handleFoodSelect(food)}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-gray-500 transition-all duration-300 shadow-md"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-8 w-full">
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

              {/* Infinite Scrolling Food Marquee */}
              {foods.length > 0 && (
                <div className="overflow-hidden mt-8">
                  <div className="marquee flex gap-6">
                    {[...foods, ...foods].map(
                      (
                        food,
                        index // Duplicate foods for seamless loop
                      ) => (
                        <div
                          key={`${food._id}-${index}`}
                          className="bg-gray-800/50 p-4 rounded-xl shadow-lg flex-shrink-0 w-64"
                        >
                          <img
                            src={food.image || "/fallback-image.jpg"}
                            alt={food.foodName}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-lg font-medium">{food.foodName}</p>
                          <p className="text-sm text-gray-300">
                            ${food.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {food.ingredients || "No ingredients listed"}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Cart Modal */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold text-orange-400 mb-6">
                Your Cart
              </h2>
              {selectedFoods.length === 0 ? (
                <p className="text-gray-400">No items in your cart yet.</p>
              ) : (
                selectedFoods.map((item) => (
                  <div
                    key={item.food._id}
                    className="flex items-center mt-2 bg-gray-700/30 p-3 rounded-lg"
                  >
                    <img
                      src={item.food.image || "/fallback-image.jpg"}
                      alt={item.food.foodName || "Unknown"}
                      className="w-12 h-12 object-cover rounded-lg mr-4"
                      onError={(e) =>
                        (e.currentTarget.src = "/fallback-image.jpg")
                      }
                    />
                    <button
                      onClick={() => handleRemoveFromCart(item.food._id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
              <button
                className="px-2 py-2 rounded-3xl bg-gray-500 text-white mt-[10px]"
                onClick={() => setIsCartOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Notification Modal */}
        {isNotifOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-semibold text-orange-400 mb-6">
                Notifications
              </h2>
              {notifications.length === 0 ? (
                <p className="mb-6 text-[18px] text-gray-400">
                  No notifications yet
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="mb-4 p-3 bg-gray-700/30 rounded-lg"
                    >
                      <p className="text-gray-200">{notif.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300"
                onClick={() => setIsNotifOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Restaurant Modal */}
        {isRestaurantModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-orange-400 mb-6">
                Nearby Restaurants
              </h2>
              {restaurantLoading ? (
                <p className="text-gray-400 animate-pulse">
                  Loading restaurants...
                </p>
              ) : restaurantError ? (
                <p className="text-red-400">{restaurantError}</p>
              ) : restaurants.length === 0 ? (
                <p className="text-gray-400">No restaurants found.</p>
              ) : (
                <div className="space-y-4">
                  {restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="bg-gray-700/30 p-4 rounded-lg cursor-pointer hover:bg-gray-600/30 transition-all duration-300"
                      onClick={() => navigateToRestaurant(restaurant._id)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={restaurant.picture || "/fallback-image.jpg"}
                          alt={restaurant.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) =>
                            (e.currentTarget.src = "/fallback-image.jpg")
                          }
                        />
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {restaurant.location}
                          </p>
                          <p className="text-xs text-gray-400">
                            Phone: {restaurant.phoneNumber}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {restaurant.information}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                className="mt-6 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300"
                onClick={() => setIsRestaurantModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS for Marquee Animation */}
      <style jsx>{`
        .marquee {
          display: flex;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
