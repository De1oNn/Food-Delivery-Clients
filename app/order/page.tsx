"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { log } from "util";

interface Food {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string | string[] | undefined;
  category: string; // ObjectId as string
}


interface Category {
  _id: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SelectedFood {
  food: Food;
  quantity: number;
}

export default function Order() {
  const router = useRouter();
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);

  useEffect(() => {
    getFoods();
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ message: string; categories: Category[] }>(
        "http://localhost:5000/food-category"
      );
      const fetchedCategories = res.data.categories || [];
      console.log("Fetched categories:", fetchedCategories);
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0 && !selectedCategory) {
        setSelectedCategory(fetchedCategories[0]._id); // Optional: Set default category
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const getFoods = async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ foods: Food[] }>(
        "http://localhost:5000/food"
      );
      const fetchedFoods = res.data.foods || [];
      console.log("Fetched foods:", fetchedFoods);
      setFoods(fetchedFoods);
      setFilteredFoods(fetchedFoods);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setError("Failed to load foods.");
    } finally {
      setLoading(false);
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

  const handleDecreaseQuantity = (foodId: string) => {
    const foodItem = selectedFoods.find((item) => item.food._id === foodId);
    if (foodItem) handleFoodSelect(foodItem.food, -1);
  };

  const handleDeleteFood = (foodId: string) => {
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

  const createOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData._id;
      if (!userId) throw new Error("User information not found");

      const orderData = {
        user: userId,
        totalPrice,
        foodOrderItems: selectedFoods.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),
        status: "PENDING",
      };

      const res = await axios.post<{ message: string }>(
        "http://localhost:5000/order",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setSelectedFoods([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Error creating order:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const back = () => router.push("/dashboard");

  useEffect(() => {
    const filteredFoodsByCategory = selectedCategory
      ? foods.filter((food) => {
          const matches = food.category._id === selectedCategory;
          console.log(food.category._id, selectedCategory);

          // console.log(
          //   `Food: "${food.foodName}", Category ID: "${food.category}", Selected Category ID: "${selectedCategory}", Matches: ${matches}`
          // );
          return matches;
        })
      : foods;

    console.log(selectedCategory);
    console.log(filteredFoodsByCategory);

    setFilteredFoods(filteredFoodsByCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={back}
          className="mb-6 h-10 w-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-all duration-300 shadow-md"
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

        <h1 className="text-4xl font-extrabold text-white text-center mb-8">
          Create Your Order
        </h1>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">
            Available Foods
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-md ${
                !selectedCategory
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-700/50 hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category._id)}
                className={`px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-md ${
                  selectedCategory === category._id
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-700/50 hover:bg-gray-600"
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>

          {loading && foods.length === 0 ? (
            <p className="text-gray-400 text-center animate-pulse">
              Loading foods...
            </p>
          ) : error ? (
            <p className="text-red-400 text-center">{error}</p>
          ) : filteredFoods.length === 0 ? (
            <p className="text-gray-400 text-center">
              {selectedCategory
                ? "No foods available in this category."
                : "No foods available."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredFoods.map((food) => (
                <div
                  key={food._id}
                  className="bg-gray-800/50 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center justify-between hover:shadow-orange-500/20 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <img
                      src={food.image}
                      alt={food.foodName}
                      className="w-16 h-16 object-cover rounded-lg mr-4"
                      onError={(e) =>
                        (e.currentTarget.src = "/fallback-image.jpg")
                      }
                    />
                    <div>
                      <p className="text-lg font-medium text-white">
                        {food.foodName || "Unnamed Food"}
                      </p>
                      <p className="text-sm text-gray-300">
                        ${food.price?.toFixed(2) || "0.00"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {typeof food.ingredients === "string"
                          ? food.ingredients
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
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
          )}
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-orange-400 mb-6">
            Your Order
          </h2>
          {selectedFoods.length === 0 ? (
            <p className="text-gray-400">No items in your order yet.</p>
          ) : (
            selectedFoods.map((item) => (
              <div
                key={item.food._id}
                className="flex items-center mb-4 border-b border-gray-700/50 pb-4 last:border-b-0"
              >
                <img
                  src={item.food.image}
                  alt={item.food.foodName}
                  className="w-12 h-12 object-cover rounded-lg mr-4"
                  onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                />
                <div className="flex-1">
                  <p className="text-lg text-white">
                    {item.food.foodName} - ${item.food.price.toFixed(2)} x{" "}
                    {item.quantity} ={" "}
                    <span className="font-medium text-orange-400">
                      ${(item.food.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    {typeof item.food.ingredients === "string"
                      ? item.food.ingredients
                      : "Not specified"}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleDecreaseQuantity(item.food._id)}
                    disabled={loading}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 disabled:bg-gray-500 transition-all duration-300 shadow-md"
                  >
                    -
                  </button>
                  <button
                    onClick={() => handleDeleteFood(item.food._id)}
                    disabled={loading}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:bg-gray-500 transition-all duration-300 shadow-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          <p className="text-xl font-bold text-white mt-6">
            Total:{" "}
            <span className="text-orange-400">${totalPrice.toFixed(2)}</span>
          </p>
          {error && <p className="text-red-400 mt-2">{error}</p>}
          <button
            onClick={createOrder}
            disabled={loading || selectedFoods.length === 0}
            className="mt-6 w-full px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:bg-gray-500 transition-all duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
