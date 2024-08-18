"use client"

import ProductCard from "@/components/Product/ProductCard"
import Container from "@/components/common/container"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMenuItems } from "@/hooks/get-menu-items"
import { useCategoryMenuItems } from "@/hooks/get-menu-items-by-category"
import { useSearchParams } from "next/navigation"
import { useLayoutEffect, useRef } from "react"

interface CategoryPageProps {
    params: { id: string; type: string }
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const productId = useSearchParams().get("productId")
    const productRef = useRef<null | HTMLDivElement>(null)
    const { type } = params
    const { data: menuItems, isLoading: isLoadingMenuItems } =
        type === "category" ? useCategoryMenuItems(params.id) : useMenuItems(params.id)

    const scrollToElement = () => {
        const { current } = productRef
        if (current !== null) {
            current?.scrollIntoView({ behavior: "smooth" })
        }
    }

    useLayoutEffect(() => {
        scrollToElement()
    }, [])

    return (
        <Container title={params.type}>
            <ScrollArea className='h-screen min-w-full'>
                {!isLoadingMenuItems &&
                    !isLoadingMenuItems &&
                    menuItems?.length &&
                    menuItems.map((item) => (
                        <ProductCard
                            key={item.id}
                            ref={productId === item.id ? productRef : null}
                            classNames='mt-8 mb-2 mx-auto'
                            badge='Най-поръчвано'
                            itemData={{
                                id: item.id,
                                title: item.name,
                                price: item.price,
                                weight: 120,
                                desc: item.description,
                                type: "yellow",
                                isSelected: false,
                            }}
                        />
                    ))}
            </ScrollArea>
        </Container>
    )
}
