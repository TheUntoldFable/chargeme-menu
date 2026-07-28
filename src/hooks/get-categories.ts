import { API_BASE_URL, headers } from "@/api/config"
import { flowEndpoints, type FlowKind } from "@/lib/flow"
import { MenuCategory } from "@/models/categories"
import { getApiLanguage, useLanguageStore, type LanguageCode } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

// Returns the full category tree for a business. Categories are self-referencing
// via `children` (subcategories were removed), so no per-category follow-up
// fetch is needed — `menuItemCount` tells us which categories hold items.
export const fetchCategories = async (businessId: string, language: LanguageCode, kind: FlowKind): Promise<MenuCategory[]> => {
    try {
        if (!businessId) throw new Error("Missing businessId")
        const apiLang = getApiLanguage(language)
        const res = await fetch(`${API_BASE_URL}${flowEndpoints[kind].categories(businessId)}?lang=${apiLang}`)

        const data: MenuCategory[] = await res.json()

        return Array.isArray(data) ? data : []
    } catch (e) {
        throw new Error(`An error occurred when fetching categories - ${e}`)
    }
}

export const useCategories = (businessId: string, kind: FlowKind): UseQueryResult<MenuCategory[]> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["categories", kind, businessId, language],
        queryFn: () => fetchCategories(businessId, language, kind),
        meta: { headers },
        enabled: !!businessId,
    })
}
