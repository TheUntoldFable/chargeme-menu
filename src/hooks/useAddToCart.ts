import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { useState } from "react"
import { useRecoilState } from "recoil"

export const useAddToCart = () => {
    const { toast } = useToast()
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
        toast({
            variant: "default",
            title: "Добавяне в количка",
            description: `Продуктът ${title} е успешно добавен във вашата количка!`,
        })

        setTimeout(() => {
            setIsAddBtnActive(false)
        }, 2000)
    }

    return { cartItems, addToCart, isAddBtnActive }
}
