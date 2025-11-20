"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Item = {
    id: string;
    text: string;
    checked: boolean;
    isArchived?: boolean;
    quantity: number;
};

export type Card = {
    id: string;
    title: string;
    barcodeValue: string;
};

export type Store = {
    id: string;
    name: string;
    items: Item[];
    cards: Card[];
};

type StoreContextType = {
    stores: Store[];
    activeStoreId: string | null;
    addStore: (name: string) => void;
    selectStore: (id: string) => void;
    addItem: (text: string) => void;
    toggleItem: (itemId: string) => void;
    deleteItem: (itemId: string) => void;
    reorderItems: (activeId: string, overId: string) => void;
    getActiveStore: () => Store | undefined;
    deleteStore: (id: string) => void;
    archiveItem: (itemId: string) => void;
    unarchiveItem: (itemId: string) => void;
    moveAllBasketToArchive: () => void;
    updateItemQuantity: (itemId: string, change: number) => void;
    addCard: (card: Omit<Card, "id">) => void;
    deleteCard: (cardId: string) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = "shopping-list-data";

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [stores, setStores] = useState<Store[]>([]);
    const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setStores(parsed.stores || []);
                setActiveStoreId(parsed.activeStoreId || null);
            } catch (e) {
                console.error("Failed to load data", e);
            }
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ stores, activeStoreId })
            );
        }
    }, [stores, activeStoreId, loaded]);

    const addStore = (name: string) => {
        const newStore: Store = {
            id: crypto.randomUUID(),
            name,
            items: [],
            cards: [],
        };
        setStores((prev) => [...prev, newStore]);
        setActiveStoreId(newStore.id);
    };

    const selectStore = (id: string) => {
        setActiveStoreId(id);
    };

    const addItem = (text: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: [
                            ...store.items,
                            { id: crypto.randomUUID(), text, checked: false, isArchived: false, quantity: 1 },
                        ],
                    };
                }
                return store;
            })
        );
    };

    const toggleItem = (itemId: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: store.items.map((item) =>
                            item.id === itemId ? { ...item, checked: !item.checked } : item
                        ),
                    };
                }
                return store;
            })
        );
    };

    const deleteItem = (itemId: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: store.items.filter((item) => item.id !== itemId),
                    };
                }
                return store;
            })
        );
    };

    const reorderItems = (activeId: string, overId: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    const oldIndex = store.items.findIndex((i) => i.id === activeId);
                    const newIndex = store.items.findIndex((i) => i.id === overId);

                    if (oldIndex === -1 || newIndex === -1) return store;

                    const newItems = [...store.items];
                    const [movedItem] = newItems.splice(oldIndex, 1);
                    newItems.splice(newIndex, 0, movedItem);

                    return {
                        ...store,
                        items: newItems,
                    };
                }
                return store;
            })
        );
    };

    const getActiveStore = () => stores.find((s) => s.id === activeStoreId);

    const deleteStore = (id: string) => {
        setStores((prev) => prev.filter((store) => store.id !== id));
        if (activeStoreId === id) {
            setActiveStoreId(null);
        }
    };

    const archiveItem = (itemId: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: store.items.map((item) =>
                            item.id === itemId ? { ...item, isArchived: true } : item
                        ),
                    };
                }
                return store;
            })
        );
    };

    const unarchiveItem = (itemId: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: store.items.map((item) =>
                            item.id === itemId ? { ...item, isArchived: false, checked: false } : item
                        ),
                    };
                }
                return store;
            })
        );
    };

    const moveAllBasketToArchive = () => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: store.items.map((item) =>
                            item.checked ? { ...item, isArchived: true } : item
                        ),
                    };
                }
                return store;
            })
        );
    };

    const updateItemQuantity = (itemId: string, change: number) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        items: store.items.map((item) => {
                            if (item.id === itemId) {
                                const newQuantity = (item.quantity || 1) + change;
                                return { ...item, quantity: Math.max(1, newQuantity) };
                            }
                            return item;
                        }),
                    };
                }
                return store;
            })
        );
    };

    const addCard = (card: Omit<Card, "id">) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        cards: [
                            ...(store.cards || []),
                            { ...card, id: crypto.randomUUID() },
                        ],
                    };
                }
                return store;
            })
        );
    };

    const deleteCard = (cardId: string) => {
        if (!activeStoreId) return;
        setStores((prev) =>
            prev.map((store) => {
                if (store.id === activeStoreId) {
                    return {
                        ...store,
                        cards: (store.cards || []).filter((c) => c.id !== cardId),
                    };
                }
                return store;
            })
        );
    };

    return (
        <StoreContext.Provider
            value={{
                stores,
                activeStoreId,
                addStore,
                selectStore,
                addItem,
                toggleItem,
                deleteItem,
                reorderItems,
                getActiveStore,
                deleteStore,
                archiveItem,
                unarchiveItem,
                moveAllBasketToArchive,
                updateItemQuantity,
                addCard,
                deleteCard,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
