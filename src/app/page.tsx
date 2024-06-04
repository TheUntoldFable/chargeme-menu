'use client';

import Wrapper from '@/components/common/wrapper';
import Header from '@/components/common/header';
import CategoryCard from '@/components/common/CategoryCard';

export default function Home() {
  return (
    <main className="bg-black">
      <Wrapper>
        <Header classNames="mb-8" />
        <h1>Zdr!</h1>
        <CategoryCard
          classNames="mt-12"
          name="Храни"
          categories={[...Array(10)]}
        />
      </Wrapper>
    </main>
  );
}
