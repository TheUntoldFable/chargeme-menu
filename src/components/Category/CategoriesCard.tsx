"use client"

import MenuItem from "@/components/Category/MenuItem"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CategoriesProps } from "@/models/categories"

const CategoriesCard = ({ name, subCategories, classNames, isWine }: CategoriesProps) => {
    return (
        <Card className={` ${isWine ? "bg-wine-dark" : "bg-lightBg"} 3 relative flex w-[85%] justify-center border-[0px] ${classNames}`}>
            <CardHeader
                className={`absolute z-10 text-xl ${isWine ? "bg-wine-default" : "bg-gray"} -top-6 w-32 w-auto items-center justify-center rounded-xl border-[0px] px-4 py-2`}
            >
                <p className='font-bold capitalize'>{name ?? "Test"}</p>
            </CardHeader>
            <CardContent className='w-full rounded-lg border-none bg-lightBg pt-8'>
                {subCategories.length ? (
                    subCategories.map((subCategory, index) => (
                        <MenuItem
                            key={`${subCategory}-${index}`}
                            name={subCategory.name}
                            catQuantity={subCategory?.menuItemCount ?? 1}
                            id={subCategory.categoryId ? subCategory.categoryId : subCategory.id}
                            type={subCategory.categoryId ? "category" : "subcategory"}
                            productId={subCategory.categoryId ? subCategory.id : undefined}
                            isWine={isWine}
                        />
                    ))
                ) : (
                    <></>
                )}
            </CardContent>
        </Card>
    )
}

export default CategoriesCard
