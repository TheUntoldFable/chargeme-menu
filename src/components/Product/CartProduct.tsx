"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { CartProductProps } from "@/models/product"
import { orderState } from "@/store/order"
import Image from "next/image"
import { useRecoilState } from "recoil"

const CartProduct = ({ title, quantity, weight, id, isSelected }: CartProductProps) => {
    const [orderItems, setOrderItems] = useRecoilState(orderState)

    const onTap = () => {
        const itemIndex = orderItems.findIndex((i) => i.id === id)
        const updatedItems = [...orderItems]

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            isSelected: !isSelected,
        }

        setOrderItems(updatedItems)
    }

    return (
        <>
            <Checkbox
                onClick={onTap}
                className='mx-2 bg-transparent border-[2px] border-white text-black w-6 h-6'
                checked={isSelected}
            />
            <div className='bg-white text-black w-6 h-6 rounded-full text-center cursor-pointer absolute -top-2.5 -right-2.5'>
                {quantity}
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

export default CartProduct
