import { Product } from "@/models/product"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface CartState {
    items: Product[]
}

interface CartActions {
    addItem: (item: Product, quantity?: number) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    setItems: (items: Product[]) => void
    clearCart: () => void
}

export const useCartStore = create<CartState & CartActions>()(
    persist(
        (set) => ({
            items: [],

            addItem: (item: Product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)
                    if (existingItem) {
                        return {
                            items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i)),
                        }
                    }
                    return {
                        items: [...state.items, { ...item, isSelected: true, quantity }],
                    }
                })
            },

            removeItem: (id: string) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }))
            },

            updateQuantity: (id: string, quantity: number) => {
                set((state) => ({
                    items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                }))
            },

            setItems: (items: Product[]) => {
                set({ items })
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
)
