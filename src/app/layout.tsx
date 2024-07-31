"use client"

import { cn } from "@/lib/utils"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Inter } from "next/font/google"
import "./globals.css"

import { Toaster } from "@/components/ui/toaster"
import RecoilContextProvider from "@/recoilProvider"

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
  return (
    <html lang='en'>
      <body className={cn("min-h-screen bg-background font-sa nsantialiased", inter.variable)}>
        <Toaster />
        <RecoilContextProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </RecoilContextProvider>
      </body>
    </html>
  )
}
