"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import food from '../public/lily-banse--YHSwy6uqvk-unsplash.jpg'

export default function Page() {
  const router = useRouter();
    const [currentSection, setCurrentSection] = useState(0);

    const handleNext = () => {
      setCurrentSection((prev) => (prev === 2 ? 0 : prev + 1));
    };
    const handleBack = () => {
      setCurrentSection((prev) => (prev === 0 ? 2 : prev - 1));
    };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center px-[25%]">
      <div className="relative w-screen h-screen">
        <Image
          className="relative"
          src={food}
          layout="fill"
          objectFit="cover"
          alt="Food"
        />
      </div>
      {/* Section 1 */}
      {currentSection === 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 rounded-[100px] text-center h-[40%] w-[25%] absolute">
          <div className="p-[20px] h-[100%] w-[100%] flex flex-col justify-between">
            <h1 className="text-[40px] font-bold text-[white]">
              We serve incomparable delicacies
            </h1>
            <p className="text-[white] text-1xl">
              All the best restaurants with their top menu waiting for you, they
              cant’t wait for your order!!
            </p>
            <div className="h-[20px] w-[100%] flex justify-center items-center gap-2">
              <div className="h-[10px] w-[50px] bg-[white] rounded-4xl"></div>
              <div className="h-[10px] w-[50px] bg-[gray] rounded-4xl"></div>
              <div className="h-[10px] w-[50px] bg-[gray] rounded-4xl"></div>
            </div>
            <div className="flex w-[100%] justify-end">
              <button
                className="mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700 w-[100px]"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 2 */}
      {currentSection === 1 && (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 rounded-[100px] text-center h-[40%] w-[25%] absolute">
          <div className="p-[20px] h-[100%] w-[100%] flex flex-col justify-between">
            <h1 className="text-[40px] font-bold text-[white]">
              We serve incomparable delicacies
            </h1>
            <p className="text-[white] text-1xl">
              All the best restaurants with their top menu waiting for you, they
              cant’t wait for your order!!
            </p>
            <div className="h-[20px] w-[100%] flex justify-center items-center gap-2">
              <div className="h-[10px] w-[50px] bg-[gray] rounded-4xl"></div>
              <div className="h-[10px] w-[50px] bg-[white] rounded-4xl"></div>
              <div className="h-[10px] w-[50px] bg-[gray] rounded-4xl"></div>
            </div>
            <div className="flex justify-between">
              <button
                className="w-[100px] mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="w-[100px] mt-4 bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 3 */}
      {currentSection === 2 && (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 rounded-[100px] text-center w-[25%] h-[40%] flex flex-col justify-between absolute">
          {/* Content */}
          <div className="p-[20px] h-[100%] w-[100%] flex flex-col justify-between">
            <h1 className="text-[40px] font-bold text-[white]">
              We serve incomparable delicacies
            </h1>
            <p className="text-[white] text-1xl">
              All the best restaurants with their top menu waiting for you, they
              cant’t wait for your order!!
            </p>
            <div className="h-[20px] w-[100%] flex justify-center items-center gap-2">
              <div className="h-[10px] w-[50px] bg-[gray] rounded-4xl"></div>
              <div className="h-[10px] w-[50px] bg-[gray] rounded-4xl"></div>
              <div className="h-[10px] w-[50px] bg-[white] rounded-4xl"></div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4 z-10">
            <button
              className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-gray-600 hover:shadow-lg transition-all duration-300"
              onClick={handleBack}
            >
              Back
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-4 z-10">
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md h-12 w-24 font-semibold hover:from-blue-600 hover:to-cyan-600 hover:scale-105 transition-all duration-300 shadow-md"
              onClick={() => router.push("/sign-up")}
            >
              Sign-Up
            </button>
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md h-12 w-24 font-semibold hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-300 shadow-md"
              onClick={() => router.push("/log-in")}
            >
              Log-In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}