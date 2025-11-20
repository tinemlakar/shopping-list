"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function StoreSelector() {
    const { stores, activeStoreId, addStore, deleteStore } = useStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newStoreName, setNewStoreName] = useState("");
    const router = useRouter();

    const handleCreateStore = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStoreName.trim()) {
            addStore(newStoreName.trim());
            setNewStoreName("");
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <StoreIcon className="w-5 h-5" />
                    </div>
                    My Stores
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreating(!isCreating)}
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    New
                </Button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateStore} className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input
                        placeholder="Store name..."
                        value={newStoreName}
                        onChange={(e) => setNewStoreName(e.target.value)}
                        autoFocus
                        className="border-indigo-200 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Add</Button>
                </form>
            )}

            <div className="grid grid-cols-2 gap-3">
                {stores.map((store) => (
                    <div
                        key={store.id}
                        className={cn(
                            "relative group flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden",
                            "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-700 hover:shadow-sm"
                        )}
                    >
                        {/* Navigation Layer - Handles click for the card background */}
                        <div
                            className="absolute inset-0 z-10 cursor-pointer"
                            onClick={() => router.push(`/shop/${store.id}`)}
                        />

                        {/* Gradient Layer - Decorative */}
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-indigo-100/30 pointer-events-none"
                        )} />

                        {/* Content Layer */}
                        <div className="flex justify-between items-start w-full relative z-20 pointer-events-none">
                            <span className="font-semibold truncate pr-2">{store.name}</span>
                        </div>
                        <span className="text-xs mt-1 relative z-20 text-gray-500 group-hover:text-indigo-500 transition-colors pointer-events-none">
                            {store.items.filter((i) => !i.checked).length} items
                        </span>
                    </div>
                ))}
            </div>

            {stores.length === 0 && !isCreating && (
                <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    No stores yet. Create one to start!
                </div>
            )}
        </div>
    );
}
