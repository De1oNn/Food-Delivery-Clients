// restaurant
interface Restaurant {
  _id: string;
  location: string;
  picture: string;
  name: string;
  information: string;
  phoneNumber: number;
  createdAt: string;
}
//order
interface Category {
  _id: string;
  categoryName: string;
  createdAt?: string;
  updatedAt?: string;
}
//dashboard
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

interface FoodOrderItem {
  food: Food | null;
  quantity: number;
}

interface Order {
  _id: string;
  user: { name: string };
  email?: string;
  foodOrderItems: FoodOrderItem[];
  createdAt: string;
  status: "PENDING" | "CANCELED" | "DELIVERED";
}
//profile 
interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber: string;
  createdAt?: string;
  profilePicture?: string;
}
//sign-up
