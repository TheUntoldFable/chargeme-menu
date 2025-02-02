"use client"

import CategoriesCard from "@/components/Category/CategoriesCard"
import Container from "@/components/common/container"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCategories } from "@/hooks/get-categories"
import { useJoinTable } from "@/hooks/send-payment-data"
import { restaurantState } from "@/store/restaurant"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRecoilState } from "recoil"

export default function Home() {
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)
    const params = useSearchParams()
    const { data: categories, isLoading } = useCategories()
    const { mutateAsync: joinTable, status } = useJoinTable()

    useEffect(() => {
        const tableId = params.get("tableId")

        if (tableId) {
            joinTable(tableId)
            setRestaurantInfo({ restaurantId: "test", tableId })
        }
    }, [params])

    return (
        <main>
            <Container title='Добре дошли!'>
                <ScrollArea className='h-screen min-w-full'>
                    {!isLoading && status !== "pending" ? (
                        categories?.length &&
                        categories.map(
                            (item, index) =>
                                !!item.subcategories.length && (
                                    <CategoriesCard
                                        key={item.id}
                                        classNames='mt-8 mb-2 mx-auto'
                                        name={item.name}
                                        subCategories={item.subcategories}
                                        isWine={index === 0}
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
