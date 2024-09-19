import { Product } from "@/models/product"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const calculateTotalPrice = (items: Product[], withSelection: boolean): string => {
    let totalPrice = 0
    if (withSelection) items = items.filter((item) => item.isSelected)
    items.forEach((item) => {
        totalPrice += item.quantity * item.price
    })

    return totalPrice.toFixed(2)
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
