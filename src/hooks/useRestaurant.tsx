import { API, headers } from "@/api/config"
import { GetRestaurantResponse } from "@/models/restaurant"
import { languageState } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { useRecoilValue } from "recoil"

export const getRestaurantById = async (restaurantId: string): Promise<GetRestaurantResponse> => {
    const { data } = await API.get(`/restaurants/${restaurantId}`)
    return data
}

export const useRestaurant = (restaurantId: string): UseQueryResult<GetRestaurantResponse> => {
    const language = useRecoilValue(languageState)
    return useQuery({
        queryKey: ["restaurant", restaurantId, language],
        queryFn: () => getRestaurantById(restaurantId),
        meta: { headers },
        retry: false,
        enabled: !!restaurantId,
    })
}
