"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";

export function ArchiveView() {
    const { getActiveStore, unarchiveItem, deleteItem, updateItemQuantity } = useStore();
    const activeStore = getActiveStore();

    if (!activeStore) {
        return null;
    }

    const items = activeStore.items.filter((i) => i.isArchived);

    return (
        <div className="space-y-4">
            {items.length === 0 && (
                <div className="text-center py-12 text-gray-400 font-medium bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    Archive is empty.
                </div>
            )}

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50/80 border border-gray-100 rounded-xl opacity-75 hover:opacity-100 transition-all duration-200 group"
                    >
                        <span className="flex-1 font-medium text-gray-500">
                            {item.text}
                        </span>

                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateItemQuantity(item.id, -1)}
                                className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm text-gray-500"
                                disabled={item.quantity !== undefined && item.quantity <= 1}
                            >
                                -
                            </Button>
                            <span className="text-sm font-medium w-6 text-center text-gray-700">{item.quantity || 1}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateItemQuantity(item.id, 1)}
                                className="h-6 w-6 rounded-md hover:bg-white hover:shadow-sm text-gray-500"
                            >
                                +
                            </Button>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => unarchiveItem(item.id)}
                                className="h-8 w-8 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                                title="Move to List"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteItem(item.id)}
                                className="h-8 w-8 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full"
                                title="Delete permanently"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
