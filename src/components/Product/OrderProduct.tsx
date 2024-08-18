"use client"

import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import Image from "next/image"
import { useRecoilState } from "recoil"
import IconPlus from "../../../public/svg/IconPlus"
import { toast } from "../ui/use-toast"

interface ProductCardProps {
    itemData: Product
}

const OrderProduct = ({ itemData }: ProductCardProps) => {
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

    if (!itemData) return null

    const { title, weight, id } = itemData

    return (
        <>
            <div
                className='bg-yellow rounded-full p-1 cursor-pointer absolute -top-2.5 -right-2.5 rotate-45'
                onClick={handleRemoveFromCart}
            >
                <IconPlus color='#880808' />
            </div>
            <Image
                src='/images/pizza.png'
                width={200}
                height={200}
                className='w-[50%] mb-4'
                alt='Img'
            />
            <div className='flex flex-1 flex-col gap-4 px-4 mb-4 justify-between'>
                <h2 className='text-2xl'>{title}</h2>
                <div className='flex flex-row justify-between gap-1'>
                    <div className='flex gap-2'>
                        <p>{weight}гр.</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderProduct
