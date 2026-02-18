"use client"

import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export const DropdownMenuCheckboxes = () => {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)
    const t = useTranslations("product")

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    className='bg-lightBg mb-6 w-full rounded-2xl border-0 py-2 pr-2 pl-4 text-center text-white'
                >
                    {t("optionsWithout")}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-lightBg w-56 w-full border-0 text-white'>
                <DropdownMenuCheckboxItem
                    checked={showStatusBar}
                    onCheckedChange={setShowStatusBar}
                >
                    {t("ingredients.mushrooms")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={showActivityBar}
                    onCheckedChange={setShowActivityBar}
                >
                    {t("ingredients.tomatoes")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                    checked={showPanel}
                    onCheckedChange={setShowPanel}
                >
                    {t("ingredients.chickenFillet")}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
