'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Container from '@/components/common/container';
import CategoriesCard from '@/components/Category/CategoriesCard';
import { useCategories } from '@/hooks/get-categories';

export default function Home() {
    const { data, isLoading } = useCategories();
    return (
        <main>
            <Container title="Добре дошли!">
                <ScrollArea className="h-screen min-w-full">
                    {!isLoading && data?.length && data.map((item) => (
                        <CategoriesCard
                            key={item.id}
                            classNames="mt-8 mb-2 mx-auto"
                            name={item.name}
                            subCategories={item.subcategories}
                        />
                    ))}
                </ScrollArea>
            </Container>
        </main>
    );
}
