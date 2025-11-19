"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Item = {
    id: string;
    text: string;
    checked: boolean;
};

export type Store = {
    id: string;
    name: string;
    items: Item[];
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
                            { id: crypto.randomUUID(), text, checked: false },
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
