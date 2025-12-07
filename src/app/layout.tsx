import "@smastrom/react-rating/style.css"
import { Inter } from "next/font/google"
import "./globals.css"

import ClientProviders from "@/components/providers/ClientProviders"
import { cn } from "@/lib/utils"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

// Force dynamic rendering for all pages to avoid Recoil SSR issues
export const dynamic = "force-dynamic"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <head>
                <title>ChargeMe Menu</title>
            </head>
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
