"use client"

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
import { toast } from "@/components/ui/use-toast"
import { cartState } from "@/store/cart"
import { useRouter } from "next/navigation"
import { useRecoilState } from "recoil"

interface OrderPageProps {
  params: { id: string }
}

export default function OrderPage({ params }: OrderPageProps) {
  const [cartItems, setCartItems] = useRecoilState(cartState)

  const router = useRouter()

  const onOrder = () => {
    router.push("./cart")
  }

  const handleRemoveFromCart = () => {
    setCartItems([])
    toast({
      variant: "destructive",
      title: "Премахване от количка",
      description: `Количката е изчистена`,
    })
  }
  return (
    <Container title='Избрано'>
      <ScrollArea className='h-screen min-w-full'>
        {cartItems.map((i) => (
          <SelectedProduct
            key={i.id}
            classNames='mt-8 mb-2 mx-auto'
            itemData={i}
          />
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
              onClick={onOrder}
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
