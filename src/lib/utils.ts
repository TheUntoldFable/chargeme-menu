import { Product } from "@/models/product"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const calculateTotalPrice = (
    items: Product[],
    withSelection: boolean,
    tempQuantity?: {
        [key: string]: number
    }
): number => {
    let totalPrice = 0

    const hasTempQuantity = tempQuantity && Object.keys(tempQuantity).length > 0

    if (withSelection) items = items.filter((item) => item.isSelected)

    items.forEach((item) => {
        totalPrice += (hasTempQuantity ? tempQuantity?.[item.id] : item?.quantity) * item.price
    })

    return totalPrice
}

export const stringToStripeAmount = (str: string): number => Math.round(parseFloat(str) * 100)

export const formatAmount = (amount: number): string =>
    new Intl.NumberFormat("bg-BG", {
        style: "currency",
        currency: "BGN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
        .format(amount / 100)
        .replace(/\s/g, "")
