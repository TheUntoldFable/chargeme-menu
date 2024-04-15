'use client';

import Container from '@/components/common/container';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectedProduct from '@/components/Product/SelectedProduct';
import { useRecoilValue } from 'recoil';
import { cartState } from '@/store/cart';

interface OrderPageProps {
  params: { id: string };
}

export default function OrderPage({ params }: OrderPageProps) {
  const cartItems = useRecoilValue(cartState);
  return (
    <Container title="Пици">
      <ScrollArea className="h-screen min-w-full">
        {cartItems.map((i) => (
          <SelectedProduct
            key={i.id}
            classNames="mt-8 mb-2 mx-auto"
            itemData={i}
          />
        ))}
      </ScrollArea>
    </Container>
  );
}
