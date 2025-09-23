import { API, headers } from "@/api/config"
import { GetRestaurantResponse } from "@/models/restaurant"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const getRestaurantById = async (restaurantId: string): Promise<GetRestaurantResponse> => {
    const { data } = await API.get(`/restaurants/${restaurantId}`)
    return data
}

export const useRestaurant = (restaurantId: string): UseQueryResult<GetRestaurantResponse> => {
    return useQuery({
        queryKey: ["restaurant", restaurantId],
        queryFn: () => getRestaurantById(restaurantId),
        meta: { headers },
        retry: false,
        enabled: !!restaurantId,
    })
}
