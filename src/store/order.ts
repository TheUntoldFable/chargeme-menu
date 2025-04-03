import { Product } from "@/models/product"
import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const localStorage = typeof window !== `undefined` ? window.localStorage : undefined

const { persistAtom } = recoilPersist({
    key: "recoil-persist", // this key is using to store data in local storage
    storage: localStorage, // configure which storage will be used to store the data
})

export const orderState = atom<{ orderId: string | null; orderItems: Product[] | [] }>({
    key: "Order",
    default: {
        orderId: null,
        orderItems: [],
    },
    // eslint-disable-next-line camelcase
    effects_UNSTABLE: [persistAtom],
})

export const orderPrice = atom<number>({
    key: "OrderPrice",
    default: 0,
    // eslint-disable-next-line camelcase
    effects_UNSTABLE: [persistAtom],
})
