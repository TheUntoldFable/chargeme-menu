'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MenuItem from '@/components/Category/MenuItem';
import { CategoriesProps } from '@/types/categories';

const CategoriesCard = ({ name, subCategories, classNames }: CategoriesProps) => {
    return (
        <Card
            className={`
     bg-transparent
     relative
     w-[85%]
     border-defaultGray
     border-[1px]
     flex
     justify-center ${classNames}`}
        >
            <CardHeader
                className="
        z-10
      text-xl
      absolute
      bg-black
      items-center
      justify-center
      border-defaultGray
      border-[1px]
      -top-6
      w-32
      py-2
      px-4
      rounded-xl"
            >
                <p className="font-bold capitalize">{name ?? 'Test'}</p>
            </CardHeader>
            <CardContent className="w-full bg-black bg-opacity-55 rounded-lg pt-8 border-none">
                {subCategories.length && subCategories.map((subCategory, index) => (
                    <MenuItem key={`${subCategory}-${index}`} name={subCategory.name} catQuantity={subCategories.length} id={subCategory.id}/>
                ))}
            </CardContent>
        </Card>
    );
};

export default CategoriesCard;
