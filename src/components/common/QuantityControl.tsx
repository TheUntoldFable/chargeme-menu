"use client"

import IconMinus from "#/public/svg/icons/IconMinus"
import IconPlus from "#/public/svg/icons/IconPlus"
import { useTranslations } from "next-intl"
import React from "react"
import { toast } from "../ui/use-toast"
interface QuantityControlProps {
    tempQuantity?: number
    quantity: number
    increment: (id: string | number, quantity: number, source: "cart" | "order") => void
    decrement: (id: string | number, quantity: number, source: "cart" | "order") => void
    id: string | number
    actionsDisabled?: boolean
    source: "cart" | "order"
}

const QuantityControl: React.FC<QuantityControlProps> = ({
    tempQuantity,
    quantity,
    increment,
    decrement,
    id,
    actionsDisabled = true,
    source,
}) => {
    const t = useTranslations("common.impossibleStep")

    const handleOnClick = (
        event: React.MouseEvent<HTMLDivElement>,
        callback?: (id: string | number, quantity: number, source: "cart" | "order") => void
    ) => {
        event.preventDefault()
        // Prevent user from increasing more than ordered
        if (tempQuantity && tempQuantity === quantity && callback?.name === "increment") {
            toast({
                variant: "destructive",
                title: t("title"),
                description: t("description"),
            })
        } else {
            callback?.(id, tempQuantity ? tempQuantity : quantity, source)
        }
    }

    return (
        <div className='flex w-1/3 items-center justify-between text-white'>
            <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    actionsDisabled ? "border-yellowNew cursor-pointer bg-transparent" : "border-lightGray"
                }`}
                onClick={(event) => actionsDisabled && handleOnClick(event, decrement)}
            >
                <IconMinus />
            </div>
            <span className={`${!actionsDisabled ? "text-lightGray" : ""}`}>{tempQuantity ? tempQuantity : quantity}</span>
            <div
                className={`rounded-full p-1 ${actionsDisabled ? "bg-yellow cursor-pointer" : "bg-lightGray cursor-not-allowed"}`}
                onClick={(event) => actionsDisabled && handleOnClick(event, increment)}
            >
                <IconPlus color='black' />
            </div>
        </div>
    )
}

export default QuantityControl
