import { Product } from "@/models/product"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface OrderState {
    orderId: string | null
    orderItems: Product[]
    remainingItems: Product[]
    paid: boolean | string
    status: string
    transactionSessionId: string | null
    price: number
}

interface OrderActions {
    setOrder: (order: Partial<OrderState>) => void
    setOrderItems: (items: Product[]) => void
    toggleSelect: (id: string) => void
    incrementItem: (id: string) => void
    decrementItem: (id: string) => void
    attachSessionId: (sessionId: string) => void
    setPrice: (price: number) => void
    clearOrder: () => void
}

const initialState: OrderState = {
    orderId: null,
    orderItems: [],
    remainingItems: [],
    status: "",
    paid: false,
    transactionSessionId: null,
    price: 0,
}

export const useOrderStore = create<OrderState & OrderActions>()(
    persist(
        (set) => ({
            ...initialState,

            setOrder: (order) => set((state) => ({ ...state, ...order })),

            setOrderItems: (items: Product[]) => set({ orderItems: items }),

            toggleSelect: (id: string) => {
                set((state) => ({
                    orderItems: state.orderItems.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item)),
                }))
            },

            incrementItem: (id: string) => {
                set((state) => ({
                    orderItems: state.orderItems.map((item) =>
                        item.id === id ? { ...item, tempQuantity: (item.tempQuantity || 0) + 1 } : item
                    ),
                }))
            },

            decrementItem: (id: string) => {
                set((state) => ({
                    orderItems: state.orderItems.map((item) =>
                        item.id === id && (item.tempQuantity || 0) > 1 ? { ...item, tempQuantity: (item.tempQuantity || 0) - 1 } : item
                    ),
                }))
            },

            attachSessionId: (sessionId: string) => {
                set({ transactionSessionId: sessionId })
            },

            setPrice: (price: number) => set({ price }),

            clearOrder: () => set(initialState),
        }),
        {
            name: "order-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
)
