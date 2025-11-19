"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    TouchSensor,
    MouseSensor,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStore } from "@/lib/store";
import { SortableItem } from "./SortableItem";

export function ShoppingListView() {
    const { getActiveStore, toggleItem, reorderItems } = useStore();
    const activeStore = getActiveStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor),
        useSensor(MouseSensor)
    );

    if (!activeStore) {
        return (
            <div className="text-center py-12 text-gray-500">
                Select or create a store to start your list.
            </div>
        );
    }

    const items = activeStore.items.filter((i) => !i.checked);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            reorderItems(active.id as string, over.id as string);
        }
    };

    return (
        <div className="space-y-6">


            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                text={item.text}
                                onToggle={() => toggleItem(item.id)}
                            />
                        ))}
                        {items.length === 0 && (
                            <div className="text-center py-12 text-gray-400 font-medium bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                Your list is empty. Add some items!
                            </div>
                        )}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}
