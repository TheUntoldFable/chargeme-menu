import { API, headers } from "@/api/config"
import { GetRestaurantResponse } from "@/models/restaurant"
import { useLanguageStore } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const getRestaurantById = async (restaurantId: string): Promise<GetRestaurantResponse> => {
    const { data } = await API.get(`/restaurants/${restaurantId}`)
    return data
}

export const useRestaurant = (restaurantId: string): UseQueryResult<GetRestaurantResponse> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["restaurant", restaurantId, language],
        queryFn: () => getRestaurantById(restaurantId),
        meta: { headers },
        retry: false,
        enabled: !!restaurantId,
    })
}
