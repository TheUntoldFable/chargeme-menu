import { useQuery } from '@tanstack/react-query';

export type TGithubUser = {
    name: string;
    bio: string;
};

export const fetchMenuItems = async () => {
    const res = await fetch('https://api.chargem3.com/menu-items');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return data;
};

export const useMenuItems = () => {
    return useQuery({ queryKey: ['test'], queryFn: fetchMenuItems, meta: { headers: { 'Access-Control-Allow-Origin': '*' } } });
};