"use client"

import { useLanguageStore, type LanguageCode } from "@/store/language"
import { NextIntlClientProvider } from "next-intl"
import { useEffect, useState } from "react"
import bgMessages from "../../../messages/bg.json"
import enMessages from "../../../messages/en.json"

const messages: Record<LanguageCode, typeof bgMessages> = {
    BG: bgMessages,
    EN: enMessages,
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
    const language = useLanguageStore((state) => state.language)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // During SSR or initial hydration, use a default locale
    const locale = mounted ? language.toLowerCase() : "bg"
    const currentMessages = messages[language]

    return (
        <NextIntlClientProvider
            locale={locale}
            messages={currentMessages}
        >
            {children}
        </NextIntlClientProvider>
    )
}
