export interface Product {
    id: string | number
    title: string
    desc: string
    // TODO: use real states for type
    type?: "yellow" | "red" | "green"
    weight: number
    price: number
    isSelected: boolean
    quantity?: number
}
