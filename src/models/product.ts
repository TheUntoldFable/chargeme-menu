export interface Product {
    id: string | number
    title: string
    desc: string
    // TODO: use real states for type
    type?: "yellow" | "red" | "green"
    weight: number
    price: number
    isSelected: boolean
    quantity: number
}

export interface CartProductProps {
    title: string
    weight: number
    id: string | number
    isSelected: boolean
    quantity: number
}

export interface OrderProductProps {
    title: string
    weight: number
    id: string | number
}

export interface ProductCardProps {
    id: string | number
    price: number
    quantity: number
    tempQuantity?: number
    classNames?: string
    decrement: (id: string | number, quantity: number) => void
    increment: (id: string | number, quantity: number) => void
    children: React.ReactNode
}
