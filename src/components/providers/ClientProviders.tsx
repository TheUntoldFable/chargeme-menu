"use client"

import { AppWrapper } from "@/components/common/AppWrapper"
import { IntlProvider } from "@/components/providers/intl-provider"
import { LocationProvider } from "@/components/providers/location-provider"
import { Toaster } from "@/components/ui/toaster"
import RecoilContextProvider from "@/store/recoilProvider"
import { HydrationOverlay } from "@builder.io/react-hydration-overlay"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"

const queryClient = new QueryClient()

interface ClientProvidersProps {
    children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
    const env = process.env.NODE_ENV

    return (
        <>
            <Toaster />
            <RecoilContextProvider>
                <IntlProvider>
                    <QueryClientProvider client={queryClient}>
                        <Suspense>
                            <LocationProvider>
                                {env !== "production" ? (
                                    <HydrationOverlay>
                                        <AppWrapper>{children}</AppWrapper>
                                    </HydrationOverlay>
                                ) : (
                                    <AppWrapper>{children}</AppWrapper>
                                )}
                            </LocationProvider>
                        </Suspense>
                    </QueryClientProvider>
                </IntlProvider>
            </RecoilContextProvider>
        </>
    )
}
