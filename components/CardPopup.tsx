"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Barcode from "react-barcode";
import { Card, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CardPopupProps {
    card: Card;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CardPopup({ card, open, onOpenChange }: CardPopupProps) {
    const { deleteCard } = useStore();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this card?")) {
            deleteCard(card.id);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">{card.title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-6 space-y-8">
                    <div className="bg-white p-4 rounded-lg shadow-inner">
                        <Barcode value={card.barcodeValue} height={100} width={2.5} fontSize={20} />
                    </div>

                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="w-full sm:w-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Card
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
