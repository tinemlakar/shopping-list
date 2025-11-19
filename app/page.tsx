"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { StoreProvider, useStore } from "@/lib/store";
import { StoreSelector } from "@/components/StoreSelector";
import { ShoppingListView } from "@/components/ShoppingListView";
import { BasketView } from "@/components/BasketView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, ShoppingBasket, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AppContent() {
  const [activeTab, setActiveTab] = useState("list");
  const { getActiveStore, addItem } = useStore();
  const activeStore = getActiveStore();
  const [newItemText, setNewItemText] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-10px 0px 0px 0px" }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      addItem(newItemText.trim());
      setNewItemText("");
    }
  };

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
          <div className="p-6 pb-2">
            <StoreSelector />
          </div>

          <div ref={sentinelRef} className="h-px w-full" />

          <div className={cn(
            "sticky top-0 z-20 transition-all duration-300 border-b border-gray-100/50",
            isSticky ? "bg-white/95 backdrop-blur-md shadow-md pt-4 pb-4 px-6" : "bg-transparent px-6 pb-6"
          )}>
            <div className={cn(
              "overflow-hidden transition-all duration-300 flex justify-center",
              isSticky ? "max-h-10 mb-4 opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="px-4 py-1.5 bg-indigo-100/50 rounded-full text-indigo-700 font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                {activeStore?.name || "Select a store"}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100/80 p-1.5 rounded-xl">
                <TabsTrigger value="list" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300">
                  <ShoppingCart className="w-4 h-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="basket" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-300">
                  <ShoppingBasket className="w-4 h-4" />
                  Basket
                </TabsTrigger>
              </TabsList>

              {activeTab === "list" && (
                <form onSubmit={handleAddItem} className="flex gap-3 relative group animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input
                    placeholder="Add item..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="text-lg py-6 pl-5 border-gray-200 shadow-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all bg-white/80"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl"
                  >
                    <Plus className="w-6 h-6" />
                  </Button>
                </form>
              )}
            </Tabs>
          </div>

          <div className="p-6 pt-2 min-h-[300px]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="list" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ShoppingListView />
              </TabsContent>

              <TabsContent value="basket" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <BasketView />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
