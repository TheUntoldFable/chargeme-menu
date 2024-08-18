"use client"

import OrderProduct from "@/components/Product/OrderProduct"
import SelectedProduct from "@/components/Product/SelectedProduct"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { toast } from "@/components/ui/use-toast"
import { cartState } from "@/store/cart"
import { orderState } from "@/store/order"
import { useRecoilState } from "recoil"

export default function OrderPage() {
    const [cartItems, setCartItems] = useRecoilState(cartState)
    const [orderItems, setOrderItems] = useRecoilState(orderState)

    const handleRemoveFromCart = () => {
        setCartItems([])
        toast({
            variant: "destructive",
            title: "Премахване от количка",
            description: `Количката е изчистена`,
        })
    }
    const createOrder = () => {
        const orderItemMap = new Map(orderItems.map((item) => [item.id, item.quantity]))
        const updatedCartItems = cartItems.map((cartItem) => {
            const orderQuantity = orderItemMap.get(cartItem.id) || 0
            return {
                ...cartItem,
                quantity: cartItem.quantity + orderQuantity,
            }
        })

        setOrderItems(updatedCartItems)
        setCartItems([])
    }

    const increment = (id: string | number, quantity: number) => {
        const itemIndex = cartItems.findIndex((i) => i.id === id)
        const updatedItems = [...cartItems]

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantity + 1,
        }

        setCartItems(updatedItems)
    }

    const decrement = (id: string | number, quantity: number) => {
        const itemIndex = cartItems.findIndex((i) => i.id === id)
        const updatedItems = [...cartItems]
        const quantityUpdated = quantity - 1

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantityUpdated,
        }
        setCartItems(quantityUpdated > 0 ? updatedItems : cartItems)
    }

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
            <Button
                className='w-[60%] text-lg gap-2 mb-4'
                type='button'
                id='add'
                variant='secondary'
                onClick={createOrder}
                disabled={!cartItems.length}
            >
                Поръчай
            </Button>
            <Button
                className='w-[60%] text-lg gap-2 mb-4'
                type='button'
                id='add'
                variant='outline'
                onClick={handleRemoveFromCart}
                disabled={!cartItems.length}
            >
                Изчисти моят избор
            </Button>
        </Container>
    )
}
