import { API, headers } from "@/api/config"
import { GetBusinessResponse } from "@/models/business"
import { useLanguageStore } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const getBusinessById = async (businessId: string): Promise<GetBusinessResponse> => {
    const { data } = await API.get(`/businesses/${businessId}`)
    return data
}

export const useBusiness = (businessId: string): UseQueryResult<GetBusinessResponse> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["business", businessId, language],
        queryFn: () => getBusinessById(businessId),
        meta: { headers },
        retry: false,
        enabled: !!businessId,
    })
}
