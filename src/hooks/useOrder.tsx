import { GetOrderResponse } from "@/models/order"
import { Product } from "@/models/product"
import { cartState } from "@/store/cart"
import { orderPrice, orderState } from "@/store/order"
import { useRecoilState } from "recoil"
import { fetchMenuItem } from "./get-menu-item"

export function useOrder() {
    const [cartItems, setCartItems] = useRecoilState<Product[] | []>(cartState)
    const [order, setOrder] = useRecoilState(orderState)
    const [price, setPrice] = useRecoilState<number>(orderPrice)

    const toggleSelect = (id: string) => {
        const updatedOrderItems = order.orderItems.map((orderItem) =>
            orderItem.id === id ? { ...orderItem, isSelected: !orderItem.isSelected } : orderItem
        )
        setOrder({ ...order, orderItems: updatedOrderItems })
    }

    const clearCart = (): void => {
        setCartItems([])
    }

    const updateOrder = async (e: GetOrderResponse): Promise<void> => {
        const orderId = e.id
        const orderItemMap: Map<string, Product> = new Map([])

        await Promise.all(
            e.orderItems.map(async (orderItem) => {
                const item = await fetchMenuItem(orderItem.menuItemId)

                orderItemMap.set(orderItem.menuItemId, {
                    ...item,
                    isSelected: true,
                    quantity: orderItem.quantity,
                    tempQuantity: orderItem.quantity,
                    orderItemId: orderItem.orderItemId,
                    processing: orderItem.processing,
                    paid: orderItem.paid,
                })
            })
        )

        const finalItems = Array.from(orderItemMap.values())
            .filter((item) => item.processing < item.quantity)
            .map((item) => {
                // Subtract processing from quantity
                return {
                    ...item,
                    quantity: item.quantity - item.processing - item.paid,
                    tempQuantity: item.quantity - item.processing - item.paid,
                }
            })

        setOrder({ orderId, orderItems: finalItems, paid: e.paid ?? false, status: e.status, remainingItems: [...finalItems] })

        if (cartItems.length > 0) {
            setCartItems([])
        }
    }

    const attachSessionID = (sessionId: string) => {
        setOrder((order) => ({ ...order, transactionSessionId: sessionId }))
    }

    const increment = (id: string | number, quantity: number, source: "cart" | "order") => {
        const items = source === "cart" ? cartItems : order.orderItems
        const itemIndex = items.findIndex((i) => i.id === id)

        if (itemIndex === -1) return

        const updatedItems = [...items]

        if (source === "cart") {
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantity: quantity + 1,
            }
            setCartItems(updatedItems)
        } else {
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                tempQuantity: quantity + 1,
            }
            setOrder({ ...order, orderItems: updatedItems })
        }
    }

    const decrement = (id: string | number, quantity: number, source: "cart" | "order") => {
        if (quantity <= 1) return

        const items = source === "cart" ? cartItems : order.orderItems
        const itemIndex = items.findIndex((i) => i.id === id)

        if (itemIndex === -1) return

        const updatedItems = [...items]

        if (source === "cart") {
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantity: quantity - 1,
            }

            setCartItems(updatedItems)
        } else {
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                tempQuantity: quantity - 1,
            }
            setOrder({ ...order, orderItems: updatedItems })
        }
    }

    const clearOrder = () => {
        setOrder({ orderId: "", status: "", orderItems: [], paid: false, remainingItems: [] })
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
        attachSessionID,
        toggleSelect,
    }
}
