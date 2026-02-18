"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguageStore, type LanguageCode } from "@/store/language"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown } from "lucide-react"

const LANGUAGES: { code: LanguageCode; label: string }[] = [
    { code: "BG", label: "BG" },
    { code: "EN", label: "EN" },
]

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguageStore()
    const queryClient = useQueryClient()

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage as LanguageCode)
        // Invalidate all queries to refetch with new language
        queryClient.invalidateQueries()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='bg-lighterGray hover:bg-gray flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none'>
                    <span>{language}</span>
                    <ChevronDown className='h-3 w-3' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align='end'
                className='border-lighterGray bg-darkGray min-w-[80px]'
            >
                <DropdownMenuRadioGroup
                    value={language}
                    onValueChange={handleLanguageChange}
                >
                    {LANGUAGES.map(({ code, label }) => (
                        <DropdownMenuRadioItem
                            key={code}
                            value={code}
                            className='hover:bg-lighterGray focus:bg-lighterGray data-[state=checked]:text-yellow cursor-pointer text-white'
                        >
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
