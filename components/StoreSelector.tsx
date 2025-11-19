"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StoreSelector() {
    const { stores, activeStoreId, selectStore, addStore } = useStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newStoreName, setNewStoreName] = useState("");

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
                    <button
                        key={store.id}
                        onClick={() => selectStore(store.id)}
                        className={cn(
                            "flex flex-col items-start p-4 rounded-xl border transition-all duration-300 text-left group relative overflow-hidden",
                            activeStoreId === store.id
                                ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 shadow-md ring-1 ring-indigo-200"
                                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-700 hover:shadow-sm"
                        )}
                    >
                        <div className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-indigo-100/30",
                            activeStoreId === store.id && "opacity-100"
                        )} />
                        <span className="font-semibold truncate w-full relative z-10">{store.name}</span>
                        <span className={cn(
                            "text-xs mt-1 relative z-10 transition-colors",
                            activeStoreId === store.id ? "text-indigo-600 font-medium" : "text-gray-500 group-hover:text-indigo-500"
                        )}>
                            {store.items.filter((i) => !i.checked).length} items
                        </span>
                    </button>
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
