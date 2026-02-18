"use client"

import { AppWrapper } from "@/components/common/AppWrapper"
import { IntlProvider } from "@/components/providers/intl-provider"
import { LocationProvider } from "@/components/providers/location-provider"
import { Toaster } from "@/components/ui/toaster"
import { StoreHydration } from "@/store/StoreHydration"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"

const queryClient = new QueryClient()

interface ClientProvidersProps {
    children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    return (
        <>
            <Toaster />
            <StoreHydration>
                <IntlProvider>
                    <QueryClientProvider client={queryClient}>
                        <Suspense>
                            <LocationProvider>
                                <AppWrapper>{children}</AppWrapper>
                            </LocationProvider>
                        </Suspense>
                    </QueryClientProvider>
                </IntlProvider>
            </StoreHydration>
        </>
    )
}
