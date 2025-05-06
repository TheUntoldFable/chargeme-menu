import { GetOrderResponse } from "@/models/order"
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

    const clearCart = (): void => {
        setCartItems([])
    }

    const updateOrder = (e: GetOrderResponse): void => {
        const orderId = e.id

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

        setOrder({ orderId, orderItems: finalOrderItems as Product[], paid: e.paid ?? false })
        setCartItems([])
        router.push("./order")
    }

    const increment = (id: string | number, quantity: number, source: "cart" | "order") => {
        const items = source === "cart" ? cartItems : order.orderItems
        const itemIndex = items.findIndex((i) => i.id === id)
        if (itemIndex === -1) return

        const updatedItems = [...items]
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantity + 1,
        }

        if (source === "cart") {
            setCartItems(updatedItems)
        } else {
            setOrder({ ...order, orderItems: updatedItems })
        }
    }

    const decrement = (id: string | number, quantity: number, source: "cart" | "order") => {
        if (quantity <= 1) return

        const items = source === "cart" ? cartItems : order.orderItems
        const itemIndex = items.findIndex((i) => i.id === id)
        if (itemIndex === -1) return

        const updatedItems = [...items]
        updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: quantity - 1,
        }

        if (source === "cart") {
            setCartItems(updatedItems)
        } else {
            setOrder({ ...order, orderItems: updatedItems })
        }
    }

    const clearOrder = () => {
        setOrder({ orderId: "", orderItems: [], paid: false })
    }

    return {
        price,
        setPrice,
        decrement,
        increment,
        cartItems,
        order,
        updateOrder,
        clearCart,
        clearOrder,
    }
}
