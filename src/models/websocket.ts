import { ReadyState } from "react-use-websocket"

export const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
}

export interface WSSendMessageItems {
    orderItemId: string
    quantity: number
}

export interface WSSendMessagePayload {
    transactionItems: WSSendMessageItems[]
    totalPrice: number
    itemsPrice: number
    tip: number
    orderId: string
}
