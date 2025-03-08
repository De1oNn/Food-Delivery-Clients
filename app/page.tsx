"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#8c4e18] via-[#ac6120] to-[#d9772e] h-screen w-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-md mb-4">
          Hello
        </h1>
        <button
          className="border-2 border-[#d9772e] bg-gradient-to-r from-[#ac6120] to-[#d9772e] text-white rounded-[10px] px-6 py-2 hover:from-[#8c4e18] hover:to-[#ac6120] hover:scale-105 transition-all duration-300 shadow-md"
          onClick={() => router.push("/sign-up")}
        >
          Sign Up
        </button>
        <button
          className="border-2 border-[#d9772e] bg-gradient-to-r from-[#ac6120] to-[#d9772e] text-white rounded-[10px] px-6 py-2 hover:from-[#8c4e18] hover:to-[#ac6120] hover:scale-105 transition-all duration-300 shadow-md"
          onClick={() => router.push("/log-in")}
        >
          Log In
        </button>
      </div>
    </div>
  );
}