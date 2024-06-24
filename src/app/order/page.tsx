'use client';

import Container from '@/components/common/container';
import { ScrollArea } from '@/components/ui/scroll-area';
import SelectedProduct from '@/components/Product/SelectedProduct';
import { useRecoilState } from 'recoil';
import { cartState } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import TotalPrice from '@/components/ui/total-price';

interface OrderPageProps {
    params: { id: string };
}

export default function OrderPage({ params }: OrderPageProps) {
    const [cartItems, setCartItems] = useRecoilState(cartState);

    const handleRemoveFromCart = () => {
        setCartItems([]);
        toast({
            variant: 'destructive',
            title: 'Премахване от количка',
            description: `Количката е изчистена`
        });
    };
    return (
        <Container title="Избрано">
            <ScrollArea className="h-screen min-w-full">
                {cartItems.map((i) => (
                    <SelectedProduct
                        key={i.id}
                        classNames="mt-8 mb-2 mx-auto"
                        itemData={i}
                    />
                ))}
            </ScrollArea>
            <TotalPrice items={cartItems} withSelection={false}/>
            <Button
                className="w-[60%] text-lg gap-2 mb-4"
                type="button"
                id="add"
                variant='secondary'
            >
                Поръчай
            </Button>
            <Button
                className="w-[60%] text-lg gap-2 mb-4"
                type="button"
                id="add"
                variant='outline'
                onClick={handleRemoveFromCart}
            >
                Изчисти моят избор
            </Button>
        </Container>
    );
}
