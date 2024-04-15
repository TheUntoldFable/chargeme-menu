'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Container from '@/components/common/container';
import CategoriesCard from '@/components/Category/CategoriesCard';

export default function Home() {
  return (
    <main>
      <Container title="Добре дошли!">
        <ScrollArea className="h-screen min-w-full">
          {[...Array(10)].map(() => (
            <CategoriesCard
              classNames="mt-8 mb-2 mx-auto"
              name="Храни"
              categories={[...Array(10)]}
            />
          ))}
        </ScrollArea>
      </Container>
    </main>
  );
}
