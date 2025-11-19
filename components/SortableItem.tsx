"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
    id: string;
    text: string;
    onToggle: () => void;
}

export function SortableItem({ id, text, onToggle }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm group touch-none transition-all duration-200 hover:shadow-md hover:border-indigo-100",
                isDragging ? "opacity-50 scale-105 shadow-xl z-50" : "opacity-100"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-indigo-400 p-1 transition-colors"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <span className="flex-1 font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{text}</span>

            <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-9 w-9 rounded-full border border-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all"
            >
                <Check className="w-5 h-5" />
            </Button>
        </div>
    );
}
