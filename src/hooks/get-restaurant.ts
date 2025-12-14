import { API_BASE_URL } from "@/api/config"
import { getApiLanguage, useLanguageStore, type LanguageCode } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export interface RestaurantDetails {
    id: string
    name?: string
    latitude: number
    longitude: number
}

export const fetchRestaurantDetails = async (restaurantId: string, language: LanguageCode): Promise<RestaurantDetails> => {
    const apiLang = getApiLanguage(language)
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}?lang=${apiLang}`)
    if (!res.ok) {
        throw new Error("Failed to fetch restaurant details")
    }
    const data = (await res.json()) as Partial<RestaurantDetails>
    if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
        throw new Error("Restaurant details missing coordinates")
    }
    return {
        id: restaurantId,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
    }
}

export const useRestaurantDetails = (restaurantId?: string): UseQueryResult<RestaurantDetails, Error> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["restaurant-details", restaurantId, language],
        queryFn: () => fetchRestaurantDetails(restaurantId as string, language),
        enabled: Boolean(restaurantId),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })
}
