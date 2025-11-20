"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { Plus, Camera, X } from "lucide-react";
import { useZxing } from "react-zxing";

export function AddCardDialog() {
    const { addCard } = useStore();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [barcodeValue, setBarcodeValue] = useState("");
    const [isScanning, setIsScanning] = useState(false);

    const { ref } = useZxing({
        onDecodeResult(result) {
            setBarcodeValue(result.getText());
            setIsScanning(false);
        },
        paused: !isScanning,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && barcodeValue) {
            addCard({ title, barcodeValue });
            setOpen(false);
            setTitle("");
            setBarcodeValue("");
            setIsScanning(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) setIsScanning(false);
        }}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Card
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Loyalty Card</DialogTitle>
                </DialogHeader>

                {isScanning ? (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <video ref={ref} className="w-full h-full object-cover" />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-white hover:bg-white/20"
                            onClick={() => setIsScanning(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>
                        <div className="absolute inset-0 border-2 border-white/50 m-8 rounded-lg pointer-events-none" />
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-1">
                            Point camera at barcode
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Card Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Spar, Mercator"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="barcode">Barcode Number</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="barcode"
                                    placeholder="Scan or enter number"
                                    value={barcodeValue}
                                    onChange={(e) => setBarcodeValue(e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setIsScanning(true)}
                                    title="Scan Barcode"
                                >
                                    <Camera className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={!title || !barcodeValue}>
                                Save Card
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
