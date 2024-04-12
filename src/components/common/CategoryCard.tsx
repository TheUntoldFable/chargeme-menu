import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

interface CategoryCardProps {
  name: string;
  categories: string[];
  classNames?: string;
}

const CategoryCard = ({ name, categories, classNames }: CategoryCardProps) => {
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
        {categories.map((c) => (
          <Link href="#">
            <p className="capitalize py-1 border-b-defaultGray border-b-[1px]">
              {c ?? 'Test'}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
