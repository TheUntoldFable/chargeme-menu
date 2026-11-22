import { GetBusinessResponse } from "@/models/business"
import { createContext, ReactNode, useContext } from "react"

interface PrePayContextType {
    businessData?: GetBusinessResponse
}

const PrePayContext = createContext<PrePayContextType | null>(null)

interface PrePayProviderProps {
    children: ReactNode
    businessData?: GetBusinessResponse
}

export function PrePayProvider({ children, businessData }: PrePayProviderProps) {
    return (
        <PrePayContext.Provider
            value={{
                businessData,
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
