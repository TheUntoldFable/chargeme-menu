"use client"

import CategoriesCard from "@/components/Category/CategoriesCard"
import Center from "@/components/common/Center"
import Container from "@/components/common/container"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCategories } from "@/hooks/get-categories"
import { useGetOrderById } from "@/hooks/send-payment-data"
import { restaurantState } from "@/store/restaurant"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useRecoilState } from "recoil"

export default function Home() {
    const { data: categories, isLoading, status } = useCategories()
    const [restaurantInfo, setRestaurantInfo] = useRecoilState(restaurantState)

    const params = useSearchParams()
    const orderId = params.get("orderId")

    const { data, status: orderStatus } = useGetOrderById(orderId)

    useEffect(() => {
        if (restaurantInfo.restaurantId && restaurantInfo.tableId) return
        setRestaurantInfo({
            restaurantId: process.env.NEXT_PUBLIC_RESTAURANT_ID ?? "",
            tableId: Math.random() * 100,
        })
    }, [])

    return (
        <main>
            <Container title=''>
                <ScrollArea className='calc-height h-full min-w-full'>
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
                        <Center>
                            <Loader />
                        </Center>
                    )}
                </ScrollArea>
            </Container>
        </main>
    )
}
