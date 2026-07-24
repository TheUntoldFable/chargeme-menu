import { API, headers } from "@/api/config"
import { flowEndpoints, type FlowKind } from "@/lib/flow"
import { GetBusinessResponse } from "@/models/business"
import { useLanguageStore } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const getBusinessById = async (businessId: string, kind: FlowKind): Promise<GetBusinessResponse> => {
    const { data } = await API.get(flowEndpoints[kind].entity(businessId))
    return data
}

export const useBusiness = (businessId: string, kind: FlowKind): UseQueryResult<GetBusinessResponse> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["business", kind, businessId, language],
        queryFn: () => getBusinessById(businessId, kind),
        meta: { headers },
        retry: false,
        enabled: !!businessId,
    })
}
