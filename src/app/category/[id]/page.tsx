import ProductCard from '@/components/Product/ProductCard';
import Container from '@/components/common/container';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryPageProps {
  params: { id: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Container title="Пици">
      <ScrollArea className="h-screen min-w-full">
        {[...Array(5)].map(() => (
          <ProductCard
            classNames="mt-8 mb-2 mx-auto"
            badge="Най-поръчвано"
            itemData={{
              id: '2',
              title: 'Test',
              price: 12.99,
              weight: 120,
              desc: 'TEST',
              type: 'yellow',
              isSelected: false,
              quantity: 3
            }}
          />
        ))}
      </ScrollArea>
    </Container>
  );
}
