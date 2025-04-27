import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { useState } from "react"
import { useRecoilState } from "recoil"

export const useAddToCart = () => {
    const { toast, dismiss } = useToast()
    const [cartItems, setCartItems] = useRecoilState(cartState)
    const [isAddBtnActive, setIsAddBtnActive] = useState(false)

    const addToCart = (item: Product, title: string = "", quantity = 1) => {
        setIsAddBtnActive(true)
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find((cartItem) => cartItem.id === item.id)
            if (existingItem) {
                return prevCartItems.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
                )
            } else {
                return [...prevCartItems, { ...item, isSelected: true, quantity: quantity }]
            }
        })
        const { id: toastId } = toast({
            variant: "default",
            title: "Добавяне в поръчка",
            description: `Продуктът ${title} е успешно добавен във вашата поръчка!`,
        })

        setTimeout(() => {
            setIsAddBtnActive(false)
            dismiss(toastId)
        }, 2000)
    }

    return { cartItems, addToCart, isAddBtnActive }
}
