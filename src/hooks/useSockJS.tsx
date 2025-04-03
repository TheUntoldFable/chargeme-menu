import { connectionStatus } from "@/models/websocket"
import { Client, StompSubscription } from "@stomp/stompjs"
import { useCallback, useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"

interface UseWebSocketOptions {
    url: string
    topic: string | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage: (message: any) => void
}

/** @deprecated Use only for old browsers. */
export const useSockJS = ({ url, topic, onMessage }: UseWebSocketOptions) => {
    const [isConnected, setIsConnected] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const stompClientRef = useRef<Client | null>(null)
    const subscriptionRef = useRef<StompSubscription | null>(null)

    useEffect(() => {
        const socket = new SockJS(url)
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Auto-reconnect after 5s if disconnected
            onConnect: (e) => {
                console.log(e, "Connected to WebSocket")
                setIsConnected(true)

                if (topic) {
                    subscribeToTopic()
                }
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket")
                setIsConnected(false)
            },
            onWebSocketError: (e) => {
                console.log(`Websocket error: ${JSON.stringify(e)}`)
            },
            onChangeState: (e) => {
                console.log(`Stated changed to ${connectionStatus[e]}`)
            },
            onStompError: (frame) => {
                console.error("STOMP Error:", frame)
            },
        })

        const subscribeToTopic = () => {
            if (stompClient.connected && topic) {
                setIsSubscribed(true)
                console.log(`Subscribed to topic: ${topic}`)
                subscriptionRef.current = stompClient.subscribe(topic, (message) => {
                    onMessage(JSON.parse(message.body))
                })
            }
        }

        stompClient.activate()
        stompClientRef.current = stompClient

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe()
                setIsSubscribed(false)
            }
            stompClient.deactivate()
        }
    }, [url, topic])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendMessage = useCallback((destination: string, body: any) => {
        if (stompClientRef.current?.connected) {
            stompClientRef.current.publish({ destination, body: JSON.stringify(body) })
            console.log(`Message sent to ${destination}:`, JSON.stringify(body))
        } else {
            console.warn("WebSocket is not connected")
        }
    }, [])

    return { isConnected, sendMessage, isSubscribed }
}
