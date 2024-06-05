'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MenuItem from '@/components/Category/MenuItem';

interface CategoriesProps {
  name: string;
  categories: string[];
  classNames?: string;
}

const CategoriesCard = ({ name, categories, classNames }: CategoriesProps) => {
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
        {categories.map((c, index) => (
          <MenuItem key={`${c}-${index}`} name={c} catQuantity={12} />
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoriesCard;
