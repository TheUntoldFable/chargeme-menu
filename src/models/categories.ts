export interface MenuItem {
    id: string
    barsyId: number
    name: string
    price: number
    description: string
    categoryId: string
    subcategory: string
    allergens: string[]
    restaurant: string
    menuItemCount?: number
}

export interface MenuCategory {
    id: string
    name: string
    description: string | null
    restaurant: string | null
    subcategories: MenuItem[]
}

export interface CategoriesProps {
    name: string
    subCategories: MenuItem[]
    classNames?: string
}
