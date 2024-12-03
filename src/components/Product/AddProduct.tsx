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

    const { name, price, weight, id, description } = itemData

    const isInCart = cartItems.find((c) => c.id === id)

    const { addToCart, isAddBtnActive } = useAddToCart()

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        addToCart(itemData, itemData.name)
    }

    return (
        <>
            <div>
                <h1 className='text-base'>{name}</h1>
                <p className='truncate-text truncate text-sm text-lightGray'>{description}</p>
                <div className='flex gap-2'>
                    <p className='font-bold'>{price}лв</p>
                    <span className='text-white'>|</span>
                    {weight && <p className='text-lightGray'>{weight}гр.</p>}
                </div>
            </div>
            <Button
                className={`${isAddBtnActive ? "active" : ""} btn-check icon-container c-button-reset c-plus-to-check h-9 w-9 gap-2 rounded-full p-0 text-lg ${isWine ? "bg-wine-default text-white" : "bg-gray text-black"}`}
                type='button'
                id='add'
                variant={isInCart ? "destructive" : "default"}
                onClick={handleAddToCart}
            ></Button>
        </>
    )
}

export default forwardRef(AddProduct)
