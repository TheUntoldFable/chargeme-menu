"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { CartProductProps } from "@/models/product"
import { orderState } from "@/store/order"
import Image from "next/image"
import { useRecoilState } from "recoil"

const CartProduct = ({ name, quantity, weight, id, isSelected }: CartProductProps) => {
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
                className='mx-2 h-6 w-6 border-[2px] border-white bg-transparent text-black'
                checked={isSelected}
            />
            <div className='absolute -right-2.5 -top-2.5 h-6 w-6 cursor-pointer rounded-full bg-white text-center'>{quantity}</div>
            <Image
                src='/images/pizza.png'
                width={200}
                height={200}
                className='mb-4 w-[50%]'
                alt='Img'
            />
            <div className='mb-4 flex flex-1 flex-col justify-between gap-4 px-4'>
                <h2 className='text-2xl text-white'>{name}</h2>
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
