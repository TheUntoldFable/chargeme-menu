'use client'

import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

import RecoilContextProvider from '@/recoilProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans'
});

const queryClient = new QueryClient()

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    inter.variable
                )}
            >
                <Toaster />
                <RecoilContextProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </RecoilContextProvider>
            </body>
        </html>
    );
}
