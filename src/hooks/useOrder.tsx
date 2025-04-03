import { toast } from "@/components/ui/use-toast"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { orderPrice, orderState } from "@/store/order"
import { useRouter } from "next/navigation"
import { useRecoilState } from "recoil"

export function useOrder() {
    const router = useRouter()
    const [cartItems, setCartItems] = useRecoilState<Product[] | []>(cartState)
    const [order, setOrder] = useRecoilState(orderState)
    const [price, setPrice] = useRecoilState<number>(orderPrice)

    const handleRemoveFromCart = (): void => {
        setCartItems([])
        toast({
            variant: "destructive",
            title: "Премахване от количка",
            description: `Количката е изчистена`,
        })
    }

    const updateOrder = (orderId: string): void => {
        const orderItemMap = new Map(order.orderItems?.map((item) => [item.id, item.quantity]))

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
                const newItem = order.orderItems?.find((item) => item.id === id)

                if (!newItem || !newItem.id) {
                    return null
                }

                return {
                    orderId,
                    ...newItem,
                    quantity,
                }
            })
            .filter((item) => item !== null)

        const finalOrderItems = [...updatedCartItems, ...newOrderItems]

        setOrder({ orderId, orderItems: finalOrderItems as Product[] })
        setCartItems([])
        router.push("./order")
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
    const clearOrder = () => {
        setOrder({ orderId: "", orderItems: [] })
    }

    return {
        price,
        setPrice,
        decrement,
        increment,
        cartItems,
        order,
        updateOrder,
        handleRemoveFromCart,
        clearOrder,
    }
}
