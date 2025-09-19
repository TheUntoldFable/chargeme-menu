import { GetRestaurantResponse } from "@/models/restaurant"
import { createContext, ReactNode, useContext } from "react"

interface PrePayContextType {
    restaurantData?: GetRestaurantResponse
}

const PrePayContext = createContext<PrePayContextType | null>(null)

interface PrePayProviderProps {
    children: ReactNode
    restaurantData?: GetRestaurantResponse
}

export function PrePayProvider({ children, restaurantData }: PrePayProviderProps) {
    return (
        <PrePayContext.Provider
            value={{
                restaurantData,
            }}
        >
            {children}
        </PrePayContext.Provider>
    )
}

export function usePrePay() {
    const context = useContext(PrePayContext)
    if (!context) {
        throw new Error("usePrePay must be used within a PrePayProvider")
    }
    return context
}
