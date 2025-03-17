"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  _id: string;
  name: string;
  price: number;
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
      const res = await axios.get<{ foods: Food[] }>(
        "http://localhost:5000/food"
      );
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
        user: "USER_ID_HERE",
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
      console.error("Error creating order:", error);
      alert("Failed to create order");
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
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
              >
                <p className="text-lg text-gray-800">
                  {food.name} -{" "}
                  <span className="font-medium">${food.price}</span>
                </p>
                <button
                  onClick={() => handleFoodSelect(food)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
                >
                  Add
                </button>
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
            <p key={index} className="text-lg text-gray-800 mb-2">
              {item.food.name} - ${item.food.price} x {item.quantity} ={" "}
              <span className="font-medium">
                ${(item.food.price * item.quantity).toFixed(2)}
              </span>
            </p>
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
