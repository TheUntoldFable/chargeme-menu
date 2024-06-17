'use client'

import Container from '@/components/common/container';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectedProduct from '@/components/Product/SelectedProduct';
import { useRecoilValue } from 'recoil';
import { cartState } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TotalPrice from '@/components/ui/total-price';

interface OrderPageProps {
    params: { id: string };
}

export default function Cart({ params }: OrderPageProps) {
    const cartItems = useRecoilValue(cartState);

    return (
        <Container title="Плащане">
            <ScrollArea className="h-screen min-w-full">
                {cartItems.map((i) => (
                    <SelectedProduct
                        key={i.id}
                        classNames="mt-8 mb-2 mx-auto"
                        itemData={i}
                        isCartScreen={true}
                    />
                ))}
            </ScrollArea>
            <TotalPrice items={cartItems} withSelection={true} />
            <Button
                className="w-[60%] text-lg gap-2 mb-4"
                type="button"
                id="add"
                variant='secondary'
            >
                Плати
            </Button>
        </Container>
    );
}
