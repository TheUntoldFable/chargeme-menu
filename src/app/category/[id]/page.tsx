"use client"

import ProductCard from '@/components/Product/ProductCard';
import Container from '@/components/common/container';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMenuItems } from '@/hooks/get-menu-items';

interface CategoryPageProps {
  params: { id: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { data: menuItems, isLoading } = useMenuItems(params.id);
  return (
    <Container title="Пици">
      <ScrollArea className="h-screen min-w-full">
        {!isLoading && menuItems?.length && menuItems.map((item) => (
          <ProductCard
            classNames="mt-8 mb-2 mx-auto"
            badge="Най-поръчвано"
            itemData={{
              id: item.id,
              title: item.name,
              price: item.price,
              weight: 120,
              desc: item.description,
              type: 'yellow',
              isSelected: false,
            }}
          />
        ))}
      </ScrollArea>
    </Container>
  );
}
