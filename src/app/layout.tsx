"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Inter } from "next/font/google"
import "./globals.css"

import { AppWrapper } from "@/components/common/AppWrapper"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import RecoilContextProvider from "@/store/recoilProvider"
import { HydrationOverlay } from "@builder.io/react-hydration-overlay"
import { Suspense } from "react"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

const queryClient = new QueryClient()

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const env = process.env.NODE_ENV

    return (
        <html lang='en'>
            <head>
                <title>ChargeMe Menu</title>
            </head>
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
                <Toaster />
                <RecoilContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <Suspense>
                            {env !== "production" ? (
                                <HydrationOverlay>
                                    <AppWrapper>{children}</AppWrapper>
                                </HydrationOverlay>
                            ) : (
                                <AppWrapper>{children}</AppWrapper>
                            )}
                        </Suspense>
                    </QueryClientProvider>
                </RecoilContextProvider>
            </body>
        </html>
    )
}
