"use client";

import Image from "next/image";

import { StoreSelector } from "@/components/StoreSelector";

function AppContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8 font-sans flex items-start justify-center">
      <div className="w-full max-w-md space-y-6 my-8">
        <header className="text-center space-y-2 flex flex-col items-center">
          <div className="relative w-24 h-24 mb-2 transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo.png"
              alt="Supershop Logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight drop-shadow-sm">
            Supershop
          </h1>
          <p className="text-gray-500 font-medium">Manage your groceries with style</p>
        </header>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-black/5">
          <div className="p-6">
            <StoreSelector />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppContent />
  );
}
