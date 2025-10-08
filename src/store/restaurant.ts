import { GetRestaurantResponse } from "@/models/restaurant"
import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

export interface RestaurantInfo {
    restaurantId: string
    tableId: string
    restaurantData: GetRestaurantResponse | null
}

const localStorage = typeof window !== `undefined` ? window.localStorage : undefined

const { persistAtom } = recoilPersist({
    key: "recoil-persist", // this key is using to store data in local storage
    storage: localStorage, // configure which storage will be used to store the data
})

export const restaurantState = atom<RestaurantInfo>({
    key: "Restaurant",
    default: {
        restaurantId: "",
        tableId: "",
        restaurantData: null,
    },
    // eslint-disable-next-line camelcase
    effects_UNSTABLE: [persistAtom],
})
