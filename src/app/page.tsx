"use client"

import CategoriesCard from "@/components/Category/CategoriesCard"
import Container from "@/components/common/container"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCategories } from "@/hooks/get-categories"

export default function Home() {
    const { data: categories, isLoading } = useCategories()

    return (
        <main>
            <Container title='Добре дошли!'>
                <ScrollArea className='h-screen min-w-full'>
                    {!isLoading ? (
                        categories?.length &&
                        categories.map(
                            (item) =>
                                !!item.subcategories.length && (
                                    <CategoriesCard
                                        key={item.id}
                                        classNames='mt-8 mb-2 mx-auto'
                                        name={item.name}
                                        subCategories={item.subcategories}
                                    />
                                )
                        )
                    ) : (
                        <Loader />
                    )}
                </ScrollArea>
            </Container>
        </main>
    )
}
