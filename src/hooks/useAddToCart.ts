import { useToast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { useCartStore } from "@/store/cart"
import { useState } from "react"

export const useAddToCart = () => {
    const { toast, dismiss } = useToast()
    const { items: cartItems, setItems: setCartItems } = useCartStore()
    const [isAddBtnActive, setIsAddBtnActive] = useState(false)

    const addToCart = (item: Product, title: string = "", quantity = 1) => {
        setIsAddBtnActive(true)
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)
        if (existingItem) {
            setCartItems(
                cartItems.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem))
            )
        } else {
            setCartItems([...cartItems, { ...item, isSelected: true, quantity: quantity }])
        }

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
