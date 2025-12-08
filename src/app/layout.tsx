import "@smastrom/react-rating/style.css"
import { Inter } from "next/font/google"
import "./globals.css"

import ClientProviders from "@/components/providers/ClientProviders"
import { cn } from "@/lib/utils"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
})

// Force dynamic rendering for all pages
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
            <body className={cn("bg-background min-h-screen font-sans antialiased", inter.variable)}>
                <ClientProviders>{children}</ClientProviders>
            </body>
        </html>
    )
}
