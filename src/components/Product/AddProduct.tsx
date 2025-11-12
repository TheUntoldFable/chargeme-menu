"use client"

import { useAddToCart } from "@/hooks/useAddToCart"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { LegacyRef, forwardRef } from "react"
import { useRecoilState } from "recoil"
import { Button } from "../ui/button"

interface AddProductProps {
    itemData: Product
    classNames?: string
    isWine: boolean
}

const AddProduct = ({ itemData, isWine }: AddProductProps, ref: LegacyRef<HTMLDivElement> | undefined) => {
    const [cartItems] = useRecoilState(cartState)
    if (!itemData) return null

    const { name, price, weight, id, description, priceInEur } = itemData

    const isInCart = cartItems.find((c) => c.id === id)

    const { addToCart, isAddBtnActive } = useAddToCart()

    const truncateText = (text: string, maxLength: number = 30): string => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        addToCart(itemData, itemData.name)
    }

    return (
        <>
            <div className='min-w-0 flex-1'>
                <h1 className='text-base'>{truncateText(name)}</h1>
                <p className='text-sm text-lightGray'>{truncateText(description || "")}</p>
                <div className='flex gap-2'>
                    <p className='font-bold'>
                        {price.toFixed(2)} лв {priceInEur ? `/ €${priceInEur.toFixed(2)}` : ""}
                    </p>
                    <span className='text-white'>|</span>
                    {weight && <p className='text-lightGray'>{weight}гр.</p>}
                </div>
            </div>
            <Button
                className={`${isAddBtnActive ? "active" : ""} btn-check icon-container c-button-reset c-plus-to-check h-9 w-9 flex-shrink-0 gap-2 rounded-full p-0 text-lg ${isWine ? "bg-wine-default text-white" : "bg-gray text-black"}`}
                type='button'
                id='add'
                variant={isInCart ? "destructive" : "default"}
                onClick={handleAddToCart}
            ></Button>
        </>
    )
}

export default forwardRef(AddProduct)
