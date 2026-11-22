import { type FlowKind } from "@/lib/flow"
import { GetBusinessResponse } from "@/models/business"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface BusinessInfo {
    businessId: string
    tableId: string
    kind: FlowKind
    businessData: GetBusinessResponse | null
}

interface BusinessActions {
    setBusinessInfo: (info: Partial<BusinessInfo>) => void
    clearBusiness: () => void
}

const initialState: BusinessInfo = {
    businessId: "",
    tableId: "",
    kind: "restaurant",
    businessData: null,
}

export const useBusinessStore = create<BusinessInfo & BusinessActions>()(
    persist(
        (set) => ({
            ...initialState,
            setBusinessInfo: (info) => set((state) => ({ ...state, ...info })),
            clearBusiness: () => set(initialState),
        }),
        {
            name: "restaurant-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
)
