import { API_BASE_URL, headers } from '@/api/config';
import { Subcategory } from '@/types/categories';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export const fetchMenuItems = async (id: string): Promise<Subcategory[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/subcategory/${id}`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const data: Subcategory[] = await res.json();
    return data;
};

export const useMenuItems = (id: string): UseQueryResult<Subcategory[]> => {
    return useQuery({
        queryKey: ['menu-items', id],
        queryFn: () => fetchMenuItems(id),
        meta: { headers }
    });
};