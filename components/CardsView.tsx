"use client";

import { useStore } from "@/lib/store";
import { CardItem } from "./CardItem";
import { AddCardDialog } from "./AddCardDialog";

export function CardsView() {
    const { getActiveStore } = useStore();
    const activeStore = getActiveStore();

    if (!activeStore) {
        return null;
    }

    const cards = activeStore.cards || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Loyalty Cards</h2>
                <AddCardDialog />
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-medium bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    No cards added yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cards.map((card) => (
                        <CardItem key={card.id} card={card} />
                    ))}
                </div>
            )}
        </div>
    );
}
