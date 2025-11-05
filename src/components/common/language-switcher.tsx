"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { languageState, type LanguageCode } from "@/store/language"
import { ChevronDown } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useRecoilState } from "recoil"

const LANGUAGES: { code: LanguageCode; label: string }[] = [
    { code: "BG", label: "BG" },
    { code: "EN", label: "EN" },
]

export function LanguageSwitcher() {
    const [language, setLanguage] = useRecoilState(languageState)
    const queryClient = useQueryClient()

    const handleLanguageChange = (newLanguage: string) => {
        setLanguage(newLanguage as LanguageCode)
        // Invalidate all queries to refetch with new language
        queryClient.invalidateQueries()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-1 rounded-lg bg-lighterGray px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray focus:outline-none'>
                    <span>{language}</span>
                    <ChevronDown className='h-3 w-3' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-[80px] border-lighterGray bg-darkGray'>
                <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                    {LANGUAGES.map(({ code, label }) => (
                        <DropdownMenuRadioItem
                            key={code}
                            value={code}
                            className='cursor-pointer text-white hover:bg-lighterGray focus:bg-lighterGray data-[state=checked]:text-yellow'
                        >
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
