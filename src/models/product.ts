import { OrderItem } from "./order"

export interface Product extends OrderItem {
    id: string
    name: string
    description: string
    weight: number
    price: number
    isSelected: boolean
    quantity: number
    image: string
    tempQuantity: number
}

export interface CartProductProps {
    name: string
    weight: number
    id: string | number
    isSelected: boolean
    quantity: number
}

export interface OrderProductProps {
    name: string
    id: string | number
    quantity: number
    tempQuantity?: number
    classNames?: string
    decrement: (id: string | number, quantity: number, source: "cart" | "order") => void
    increment: (id: string | number, quantity: number, source: "cart" | "order") => void
    description: string
    price: number
}

export interface PaymentProductProps {
    id: string | number
    name: string
    quantity: number
    tempQuantity?: number
    classNames?: string
    description: string
    price: number
    splitBill: boolean
    checked: boolean
    decrement: (id: string | number, quantity: number, source: "cart" | "order") => void
    increment: (id: string | number, quantity: number, source: "cart" | "order") => void
    onCheckboxToggle: () => void
}
