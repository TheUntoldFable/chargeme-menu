"use client"

import OrderProduct from "@/components/Product/OrderProduct"
import SelectedProduct from "@/components/Product/SelectedProduct"
import Container from "@/components/common/container"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { useOrder } from "@/hooks/useOrder"

export default function OrderPage() {
    const { createOrder, cartItems, handleRemoveFromCart, increment, decrement } = useOrder()

    return (
        <Container title='Избрано'>
            <ScrollArea className='h-screen min-w-full'>
                {cartItems.map((item) => (
                    <SelectedProduct
                        key={item.id}
                        classNames='mt-8 mb-2 mx-auto'
                        increment={increment}
                        decrement={decrement}
                        {...item}
                    >
                        <OrderProduct {...item} />
                    </SelectedProduct>
                ))}
            </ScrollArea>
            <TotalPrice
                items={cartItems}
                withSelection={false}
            />
            <AlertDialog>
                <AlertDialogTrigger
                    disabled={!cartItems || cartItems.length < 1}
                    className='w-full'
                >
                    <Button
                        disabled={!cartItems || cartItems.length < 1}
                        className='
            w-[60%]
            text-lg
            gap-2
            mb-4
            active:scale-75
            transition-transform
            ease-in-out'
                        type='button'
                        id='add'
                        variant='secondary'
                    >
                        Поръчай
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='max-w-[90%]'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Сигурни ли сте, че искате да продължите?</AlertDialogTitle>
                        <AlertDialogDescription>Това ще запази поръчката ви и ще ви изпрати на следващата стъпка.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Размислих</AlertDialogCancel>
                        <AlertDialogAction
                            className={`bg-alterGreen text-white hover:text-black`}
                            onClick={createOrder}
                        >
                            Продължи
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button
                className='w-[60%] text-lg gap-2 mb-4'
                type='button'
                id='add'
                variant='outline'
                onClick={handleRemoveFromCart}
            >
                <p>Изчисти моят избор</p>
            </Button>
        </Container>
    )
}
