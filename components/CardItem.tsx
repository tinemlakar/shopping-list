"use client";

import { useState } from "react";
import Barcode from "react-barcode";
import { Card } from "@/lib/store";
import { CardPopup } from "./CardPopup";

interface CardItemProps {
    card: Card;
}

export function CardItem({ card }: CardItemProps) {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <div
                onClick={() => setShowPopup(true)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center gap-2"
            >
                <h3 className="font-semibold text-gray-800">{card.title}</h3>
                <div className="pointer-events-none opacity-80">
                    <Barcode value={card.barcodeValue} height={40} width={1.5} fontSize={12} />
                </div>
            </div>

            <CardPopup
                card={card}
                open={showPopup}
                onOpenChange={setShowPopup}
            />
        </>
    );
}
