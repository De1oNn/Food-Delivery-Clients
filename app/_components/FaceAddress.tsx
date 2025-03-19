"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import food from "../../public/lily-banse--YHSwy6uqvk-unsplash.jpg";

export default function FaceAddress() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);

  const handleNext = () => {
    setCurrentSection((prev) => (prev === 2 ? 0 : prev + 1));
  };
  const handleBack = () => {
    setCurrentSection((prev) => (prev === 0 ? 2 : prev - 1));
  };

  return (
    <div className="h-screen w-full flex justify-center items-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={food}
          layout="fill"
          objectFit="cover"
          alt="Food"
          className="opacity-70"
        />
        <div className="absolute inset-0 bg-black/30"></div> {/* Overlay */}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-[400px] bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8">
        {/* Section 1 */}
        {currentSection === 0 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Tasty Meals, Delivered
            </h1>
            <p className="text-gray-600">
              Grab delicious food from local spots with ease.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-8 bg-orange-500 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
            </div>
            <button
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {/* Section 2 */}
        {currentSection === 1 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Quick & Fresh</h1>
            <p className="text-gray-600">
              Hot meals delivered fast to your door.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-orange-500 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Section 3 */}
        {currentSection === 2 && (
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Join Now!</h1>
            <p className="text-gray-600">
              Sign up for tasty deals and easy ordering.
            </p>
            <div className="flex gap-2">
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-2 w-8 bg-orange-500 rounded-full"></div>
            </div>
            <button
              className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
              onClick={handleBack}
            >
              Back
            </button>
            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300"
                onClick={() => router.push("/auth/sign-up")}
              >
                Sign Up
              </button>
              <button
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                onClick={() => router.push("/auth/log-in")}
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
