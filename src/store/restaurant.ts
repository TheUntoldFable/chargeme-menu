import { GetRestaurantResponse } from "@/models/restaurant"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface RestaurantInfo {
    restaurantId: string
    tableId: string
    restaurantData: GetRestaurantResponse | null
}

interface RestaurantActions {
    setRestaurantInfo: (info: Partial<RestaurantInfo>) => void
    clearRestaurant: () => void
}

const initialState: RestaurantInfo = {
    restaurantId: "",
    tableId: "",
    restaurantData: null,
}

export const useRestaurantStore = create<RestaurantInfo & RestaurantActions>()(
    persist(
        (set) => ({
            ...initialState,

            setRestaurantInfo: (info) => set((state) => ({ ...state, ...info })),

            clearRestaurant: () => set(initialState),
        }),
        {
            name: "restaurant-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
)
