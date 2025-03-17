"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  ingredients: string | string[] | undefined;
}

interface SelectedFood {
  food: Food;
  quantity: number;
}

export default function Order() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getFoods();
  }, []);

  const getFoods = async () => {
    try {
      const res = await axios.get<{ foods: Food[] }>("http://localhost:5000/food");
      setFoods(res.data.foods);
    } catch (error) {
      console.error("Error fetching foods:", error);
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
    setSelectedFoods(newSelectedFoods.filter((item) => item.quantity > 0));
    setTotalPrice(
      newSelectedFoods.reduce(
        (sum, item) => sum + item.food.price * item.quantity,
        0
      )
    );
  };

  const handleDecreaseQuantity = (foodId: string) => {
    handleFoodSelect(
      selectedFoods.find((item) => item.food._id === foodId)!.food,
      -1
    );
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
    try {
      const orderData = {
        user: "507f1f77bcf86cd799439011", // Replace with your valid user ID
        totalPrice: totalPrice,
        foodOrderItems: selectedFoods.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),
        status: "PENDING",
      };
      const res = await axios.post<{ message: string }>(
        "http://localhost:5000/order",
        orderData
      );
      alert(res.data.message);
      setSelectedFoods([]);
      setTotalPrice(0);
    } catch (error) {
      // console.error("Error creating order:", error.response?.data || error.message);
      // alert("Failed to create order: " + (error.response?.data?.message || "Unknown error"));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Create Order
      </h1>

      {/* Available Foods */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Available Foods
        </h2>
        {foods.length === 0 ? (
          <p className="text-gray-500">Loading foods...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foods.map((food) => (
              <div
                key={food._id}
                className="flex flex-col p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-800">
                        {food.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${food.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFoodSelect(food)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
                  >
                    Add
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Ingredients:{" "}
                  {Array.isArray(food.ingredients)
                    ? food.ingredients.join(", ")
                    : typeof food.ingredients === "string"
                    ? food.ingredients
                    : "Not specified"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Order */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Order
        </h2>
        {selectedFoods.length === 0 ? (
          <p className="text-gray-500">No items in your order yet.</p>
        ) : (
          selectedFoods.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <img
                src={item.food.imageUrl}
                alt={item.food.name}
                className="w-12 h-12 object-cover rounded mr-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
              <div className="flex-1">
                <p className="text-lg text-gray-800">
                  {item.food.name} - ${item.food.price.toFixed(2)} x{" "}
                  {item.quantity} ={" "}
                  <span className="font-medium">
                    ${(item.food.price * item.quantity).toFixed(2)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {Array.isArray(item.food.ingredients)
                    ? item.food.ingredients.join(", ")
                    : typeof item.food.ingredients === "string"
                    ? item.food.ingredients
                    : "Not specified"}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleDecreaseQuantity(item.food._id)}
                  disabled={loading}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400 transition"
                >
                  -
                </button>
                <button
                  onClick={() => handleDeleteFood(item.food._id)}
                  disabled={loading}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        <p className="text-xl font-bold mt-4 text-gray-800">
          Total:{" "}
          <span className="text-green-600">${totalPrice.toFixed(2)}</span>
        </p>
        <button
          onClick={createOrder}
          disabled={loading || selectedFoods.length === 0}
          className="mt-4 w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}