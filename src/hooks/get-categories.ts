import { API_BASE_URL, headers } from '@/api/config';
import { MenuCategory } from '@/types/categories';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export const fetchCategories = async (): Promise<MenuCategory[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/categories`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const data: MenuCategory[] = await res.json();
    return data;
};

export const useCategories = (): UseQueryResult<MenuCategory[]> => {
    return useQuery({ queryKey: ['categories'], queryFn: fetchCategories, meta: { headers } });
};