"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ShoppingListView } from "@/components/ShoppingListView";
import { BasketView } from "@/components/BasketView";
import { ArchiveView } from "@/components/ArchiveView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, ShoppingBasket, Plus, ArrowLeft, Trash2, Archive, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShopPage() {
    const params = useParams();
    const router = useRouter();
    const { selectStore, getActiveStore, addItem, stores, deleteStore } = useStore();
    const [activeTab, setActiveTab] = useState("list");
    const [newItemText, setNewItemText] = useState("");
    const [isSticky, setIsSticky] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const storeId = params.id as string;

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (storeId) {
            selectStore(storeId);
        }
    }, [storeId, selectStore]);

    // Check if store exists, if not redirect to home
    useEffect(() => {
        if (isMounted && stores.length > 0 && !stores.find(s => s.id === storeId)) {
            router.push("/");
        }
    }, [isMounted, stores, storeId, router]);

    const activeStore = getActiveStore();

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

    const handleDeleteStore = () => {
        if (confirm("Are you sure you want to delete this store?")) {
            deleteStore(storeId);
            router.push("/");
        }
    };

    if (!isMounted) return null;
    if (!activeStore) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8 font-sans flex items-start justify-center">
            <div className="w-full max-w-md space-y-6 my-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push("/")}
                            className="rounded-full hover:bg-white/50"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-800">{activeStore.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/shop/${storeId}/cards`)}
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full"
                            title="Loyalty Cards"
                        >
                            <CreditCard className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDeleteStore}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete Store"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-black/5">
                    <div ref={sentinelRef} className="h-px w-full" />

                    <div className={cn(
                        "sticky top-0 z-20 transition-all duration-300 border-b border-gray-100/50 rounded-t-3xl",
                        isSticky ? "bg-white/95 backdrop-blur-md shadow-md pt-4 pb-4 px-6" : "bg-transparent px-6 pt-6 pb-6"
                    )}>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-100/80 p-1.5 rounded-xl">
                                <TabsTrigger value="list" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all duration-300">
                                    <ShoppingCart className="w-4 h-4" />
                                    List
                                </TabsTrigger>
                                <TabsTrigger value="basket" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm transition-all duration-300">
                                    <ShoppingBasket className="w-4 h-4" />
                                    Basket
                                </TabsTrigger>
                                <TabsTrigger value="archive" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm transition-all duration-300">
                                    <Archive className="w-4 h-4" />
                                    Archive
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

                            <TabsContent value="archive" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ArchiveView />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
