import { toast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { orderPrice, orderState } from "@/store/order"
import { useRouter } from "next/navigation"
import { useRecoilState } from "recoil"

export function useOrder() {
    const router = useRouter()
    const [cartItems, setCartItems] = useRecoilState<Product[] | []>(cartState)
    const [orderItems, setOrderItems] = useRecoilState<Product[] | []>(orderState)
    const [price, setPrice] = useRecoilState<number>(orderPrice)

    const handleRemoveFromCart = (): void => {
        setCartItems([])
        toast({
            variant: "destructive",
            title: "Премахване от количка",
            description: `Количката е изчистена`,
        })
    }

    const createOrder = (): void => {
        const orderItemMap = new Map(orderItems?.map((item) => [item.id, item.quantity]))

        const updatedCartItems = cartItems.map((cartItem) => {
            const orderQuantity = orderItemMap.get(cartItem.id) || 0
            orderItemMap.delete(cartItem.id)
            return {
                ...cartItem,
                quantity: cartItem.quantity + orderQuantity,
            }
        })

        const newOrderItems = Array.from(orderItemMap.entries())
            .map(([id, quantity]) => {
                const newItem = orderItems?.find((item) => item.id === id)

                if (!newItem || newItem.id === undefined) {
                    return null
                }

                return {
                    ...newItem,
                    quantity,
                }
            })
            .filter((item) => item !== null)

        const finalCartItems = [...updatedCartItems, ...newOrderItems]

        setOrderItems(finalCartItems as Product[])
        setCartItems([])
        router.push("./cart")
    }

    const increment = (id: string | number, quantity: number): void => {
        const itemIndex = cartItems.findIndex((i) => i.id === id)
        const updatedItems = [...cartItems]

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantity + 1,
        }

        setCartItems(updatedItems)
    }

    const decrement = (id: string | number, quantity: number): void => {
        const itemIndex = cartItems.findIndex((i) => i.id === id)
        const updatedItems = [...cartItems]
        const quantityUpdated = quantity - 1

        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantityUpdated,
        }
        setCartItems(quantityUpdated > 0 ? updatedItems : cartItems)
    }

    return {
        price,
        setPrice,
        decrement,
        increment,
        cartItems,
        orderItems,
        createOrder,
        handleRemoveFromCart,
    }
}
