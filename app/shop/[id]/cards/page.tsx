"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { CardsView } from "@/components/CardsView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function CardsPage() {
    const params = useParams();
    const router = useRouter();
    const { selectStore, getActiveStore } = useStore();
    const storeId = params.id as string;

    useEffect(() => {
        if (storeId) {
            selectStore(storeId);
        }
    }, [storeId, selectStore]);

    const activeStore = getActiveStore();

    if (!activeStore) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8 font-sans flex items-start justify-center">
            <div className="w-full max-w-md space-y-6 my-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/shop/${storeId}`)}
                        className="rounded-full hover:bg-white/50"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">{activeStore.name} Cards</h1>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ring-1 ring-black/5 p-6 min-h-[400px]">
                    <CardsView />
                </div>
            </div>
        </div>
    );
}
