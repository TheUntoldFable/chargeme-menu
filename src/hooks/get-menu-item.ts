import { API_BASE_URL, headers } from "@/api/config"
import { MenuItem } from "@/models/categories"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const fetchMenuItem = async (id: string): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/${id}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuItem = await res.json()
    return data
}

export const useMenuItem = (id: string): UseQueryResult<MenuItem> => {
    return useQuery({
        queryKey: ["menu-item", id],
        queryFn: () => fetchMenuItem(id),
        meta: { headers },
    })
}
