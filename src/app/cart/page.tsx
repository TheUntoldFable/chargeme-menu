'use client'

import Container from '@/components/common/container';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectedProduct from '@/components/Product/SelectedProduct';
import { useRecoilValue } from 'recoil';
import { Button } from '@/components/ui/button';
import TotalPrice from '@/components/ui/total-price';
import { orderState } from '@/store/order';

interface OrderPageProps {
    params: { id: string };
}

export default function Cart({ params }: OrderPageProps) {
    const orderItems = useRecoilValue(orderState);

    return (
        <Container title="Плащане">
            <ScrollArea className="h-screen min-w-full">
                {orderItems.map((item, index) => (
                    <SelectedProduct
                        key={`${item.id}-${index}`}
                        classNames="mt-8 mb-2 mx-auto"
                        itemData={item}
                        isCartScreen={true}
                    />
                ))}
            </ScrollArea>
            <TotalPrice items={orderItems} withSelection={true} />
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
