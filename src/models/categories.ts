import { Product } from "./product"

export interface MenuItem extends Product {
    id: string
    barsyId: number
    name: string
    priceInBgn: number
    priceInEur: number
    description: string
    categoryId: string
    allergens: string[]
    businessId: string
}

// Categories are now a self-referencing tree (subcategories were removed and are
// just nested categories). See API CHANGELOG section 4.
export interface MenuCategory {
    id: string
    name: string
    description: string | null
    businessId: string | null
    parentId: string | null
    menuItemCount: number
    children: MenuCategory[]
}

export interface CategoriesProps {
    name: string
    subCategories: MenuCategory[]
    classNames?: string
    isWine: boolean
}
