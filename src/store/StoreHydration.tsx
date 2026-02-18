"use client"

import { useEffect } from "react"
import { useCartStore } from "./cart"
import { useLanguageStore } from "./language"
import { useOrderStore } from "./order"
import { useRestaurantStore } from "./restaurant"

export function StoreHydration({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Rehydrate all stores on client mount
        useCartStore.persist.rehydrate()
        useOrderStore.persist.rehydrate()
        useRestaurantStore.persist.rehydrate()
        useLanguageStore.persist.rehydrate()
    }, [])

    return <>{children}</>
}
