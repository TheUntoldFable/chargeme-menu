export interface Product {
    id: string | number
    name: string
    description: string
    weight: number
    price: number
    isSelected: boolean
    quantity: number
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
    decrement: (id: string | number, quantity: number) => void
    increment: (id: string | number, quantity: number) => void
    children: React.ReactNode
    description: string
    price: number
}
