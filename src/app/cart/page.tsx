"use client"

import SelectedProduct from "@/components/Product/SelectedProduct"
import Container from "@/components/common/container"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import TotalPrice from "@/components/ui/total-price"
import { calculateTotalPrice } from "@/lib/utils"
import { cartState } from "@/store/cart"
import Link from "next/link"
import { useRecoilValue } from "recoil"

interface OrderPageProps {
  params: { id: string }
}

export default function Cart({ params }: OrderPageProps) {
  const cartItems = useRecoilValue(cartState)

  return (
    <Container title='Плащане'>
      <ScrollArea className='h-screen min-w-full'>
        {cartItems.map((i) => (
          <SelectedProduct
            key={i.id}
            classNames='mt-8 mb-2 mx-auto'
            itemData={i}
            isCartScreen={true}
          />
        ))}
      </ScrollArea>
      <TotalPrice
        items={cartItems}
        withSelection={true}
      />
      <Link
        className='w-full flex items-center justify-center'
        href={{
          pathname: "/payment",
          query: {
            totalAmount: calculateTotalPrice(cartItems, true),
          },
        }}
      >
        <Button
          disabled={!cartItems || cartItems.length < 1}
          className='w-[60%]
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
          Плати
        </Button>
      </Link>
    </Container>
  )
}
