"use client"

import { OrderProductProps } from "@/models/product"
import { cartState } from "@/store/cart"
import { useRecoilState } from "recoil"
import IconMinus from "../../../public/svg/IconMinus"
import IconPlus from "../../../public/svg/IconPlus"
import { toast } from "../ui/use-toast"

const OrderProduct = ({ title, id, increment, decrement, tempQuantity, quantity, desc, price }: OrderProductProps) => {
    console.log(quantity)
    const [cartItems, setCartItems] = useRecoilState(cartState)

    const handleRemoveFromCart = () => {
        const filteredItems = cartItems.filter((i) => i.id !== id)
        setCartItems(filteredItems)
        toast({
            variant: "destructive",
            title: "Премахване от количка",
            description: `Продуктът ${title} е успешно премахнат от вашата количка!`,
        })
    }

    return (
        <div className='relative w-full'>
            <div
                className='absolute -right-1.5 top-0 rotate-45 cursor-pointer'
                onClick={handleRemoveFromCart}
            >
                <IconPlus color='#fff' />
            </div>
            <div>
                <h1 className='text-base'>{title}</h1>
                <p className='w-52 truncate text-sm text-lightGray'>{desc}</p>
                <div className='flex h-10 w-full items-center justify-between gap-2 rounded-lg text-lg'>
                    <div className='flex gap-2'>
                        <p className='font-bold'>{price}лв </p>
                        <p className='text-lightGray'>x{quantity}</p>
                    </div>
                    <div className='flex w-1/4 items-center justify-between text-white'>
                        <div
                            className='border-yellowNew flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border bg-transparent'
                            onClick={() => decrement(id, quantity)}
                        >
                            <IconMinus />
                        </div>
                        {tempQuantity ? tempQuantity : quantity}
                        <div
                            className='cursor-pointer rounded-full bg-yellow p-1'
                            onClick={() => increment(id, quantity)}
                        >
                            <IconPlus color='black' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderProduct
