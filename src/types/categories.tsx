export interface Subcategory {
    id: string;
    barsyId: number;
    name: string;
    price: number;
    description: string;
    category: string;
    subcategory: string;
    allergens: string[];
    restaurant: string;
}

export interface MenuCategory {
    id: string;
    name: string;
    description: string | null;
    restaurant: string | null;
    subcategories: Subcategory[];
}

export interface CategoriesProps {
    name: string;
    subCategories: Subcategory[];
    classNames?: string;
}