import { API_BASE_URL } from "@/api/config"
import { flowEndpoints, type FlowKind } from "@/lib/flow"
import { getApiLanguage, useLanguageStore, type LanguageCode } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export interface BusinessDetails {
    id: string
    name?: string
    latitude: number
    longitude: number
}

export const fetchBusinessDetails = async (
    businessId: string,
    language: LanguageCode,
    kind: FlowKind
): Promise<BusinessDetails> => {
    const apiLang = getApiLanguage(language)
    const res = await fetch(`${API_BASE_URL}${flowEndpoints[kind].entity(businessId)}?lang=${apiLang}`)
    if (!res.ok) {
        throw new Error("Failed to fetch business details")
    }
    const data = (await res.json()) as Partial<BusinessDetails>
    if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
        throw new Error("Business details missing coordinates")
    }
    return {
        id: businessId,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
    }
}

export const useBusinessDetails = (businessId?: string, kind: FlowKind = "restaurant"): UseQueryResult<BusinessDetails, Error> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["business-details", kind, businessId, language],
        queryFn: () => fetchBusinessDetails(businessId as string, language, kind),
        enabled: Boolean(businessId),
        staleTime: 1000 * 60 * 5,
        retry: 1,
    })
}
