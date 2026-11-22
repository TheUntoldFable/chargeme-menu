"use client"

import { useEffect } from "react"
import { useCartStore } from "./cart"
import { useLanguageStore } from "./language"
import { useOrderStore } from "./order"
import { useBusinessStore } from "./business"

export function StoreHydration({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Rehydrate all stores on client mount
        useCartStore.persist.rehydrate()
        useOrderStore.persist.rehydrate()
        useBusinessStore.persist.rehydrate()
        useLanguageStore.persist.rehydrate()
    }, [])

    return <>{children}</>
}
