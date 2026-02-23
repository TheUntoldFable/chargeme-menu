import { GetOrderRes } from "@/models/order"
import { Product } from "@/models/product"
import { useCartStore } from "@/store/cart"
import { useLanguageStore } from "@/store/language"
import { useOrderStore } from "@/store/order"
import { fetchMenuItem } from "./get-menu-item"

export function useOrder() {
    const { items: cartItems, setItems: setCartItems, clearCart } = useCartStore()
    const {
        orderId,
        orderItems,
        remainingItems,
        paid,
        status,
        transactionSessionId,
        priceInBgn,
        setOrder,
        setOrderItems,
        toggleSelect,
        setPriceInBgn,
        clearOrder,
        attachSessionId,
        setPriceInEur,
        priceInEur,
    } = useOrderStore()
    const language = useLanguageStore((state) => state.language)

    const updateOrder = async (e: GetOrderRes): Promise<void> => {
        const newOrderId = e.id
        const orderItemMap: Map<string, Product> = new Map([])

        await Promise.all(
            e.orderItems.map(async (orderItem) => {
                const item = await fetchMenuItem(orderItem.menuItemId, language)

                orderItemMap.set(orderItem.menuItemId, {
                    ...item,
                    isSelected: true,
                    quantity: orderItem.quantity,
                    tempQuantity: orderItem.quantity,
                    orderItemId: orderItem.orderItemId,
                    remaining: orderItem.remaining,
                    processing: orderItem.processing,
                    paid: orderItem.paid,
                })
            })
        )

        const finalItems = Array.from(orderItemMap.values())
            .filter((item) => item.remaining > 0)
            .map((item) => {
                // Subtract processing from quantity
                return {
                    ...item,
                    quantity: item.remaining,
                    tempQuantity: item.remaining,
                }
            })

        setOrder({
            orderId: newOrderId,
            orderItems: finalItems,
            paid: e.paid ?? false,
            status: e.status,
            remainingItems: [...finalItems],
        })

        if (cartItems.length > 0) {
            clearCart()
        }
    }

    const increment = (id: string | number, quantity: number, source: "cart" | "order") => {
        const items = source === "cart" ? cartItems : orderItems
        const itemIndex = items.findIndex((i) => i.id === id)

        if (itemIndex === -1) return

        if (source === "cart") {
            const updatedItems = [...items]
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantity: quantity + 1,
            }
            setCartItems(updatedItems)
        } else {
            const updatedItems = [...orderItems]
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                tempQuantity: quantity + 1,
            }
            setOrderItems(updatedItems)
        }
    }

    const decrement = (id: string | number, quantity: number, source: "cart" | "order") => {
        if (quantity <= 1) return

        const items = source === "cart" ? cartItems : orderItems
        const itemIndex = items.findIndex((i) => i.id === id)

        if (itemIndex === -1) return

        if (source === "cart") {
            const updatedItems = [...items]
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                quantity: quantity - 1,
            }
            setCartItems(updatedItems)
        } else {
            const updatedItems = [...orderItems]
            updatedItems[itemIndex] = {
                ...updatedItems[itemIndex],
                tempQuantity: quantity - 1,
            }
            setOrderItems(updatedItems)
        }
    }

    return {
        priceInBgn,
        setPriceInBgn,
        setPriceInEur,
        priceInEur,
        decrement,
        increment,
        cartItems,
        order: {
            orderId,
            orderItems,
            remainingItems,
            paid,
            status,
            transactionSessionId,
        },
        updateOrder,
        clearCart,
        clearOrder,
        attachSessionID: attachSessionId,
        toggleSelect,
    }
}
