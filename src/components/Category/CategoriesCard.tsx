"use client"

import MenuItem from "@/components/Category/MenuItem"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CategoriesProps } from "@/models/categories"

const CategoriesCard = ({ name, subCategories, classNames, isWine }: CategoriesProps) => {
    return (
        <Card
            className={`
    ${isWine ? "bg-wine-gradient" : "bg-black"}
     relative
     w-[85%]
     border-defaultGray
     border-[1px]
     flex 3
     justify-center ${classNames}`}
        >
            <CardHeader
                className={`
        z-10
      text-xl
      absolute
    ${isWine ? "bg-wine-gradient" : "bg-black"}
      items-center
      justify-center
      border-defaultGray
      border-[1px]
      -top-6
      w-32
      py-2
      px-4
      rounded-xl`}
            >
                <p className='font-bold capitalize'>{name ?? "Test"}</p>
            </CardHeader>
            <CardContent className='w-full bg-black bg-opacity-55 rounded-lg pt-8 border-none'>
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
