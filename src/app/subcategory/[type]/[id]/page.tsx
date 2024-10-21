"use client"

import AddProduct from "@/components/Product/AddProduct"
import CardContainer from "@/components/Product/CardContainer"
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
    const isWine = useSearchParams().get("isWine") || "false"
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
            <ScrollArea className='h-screen min-w-full px-4'>
                {!isLoadingMenuItems &&
                    !isLoadingMenuItems &&
                    menuItems?.length &&
                    menuItems.map((item) => (
                        <CardContainer
                            key={item.id}
                            ref={productId === item.id ? productRef : null}
                            isWine={false}
                            classNames='mb-6 mx-auto bg-lightBg'
                            itemData={{
                                id: item.id,
                                title: item.name,
                                price: item.price,
                                weight: 120,
                                desc: item.description,
                                isSelected: false,
                                quantity: 0,
                            }}
                        >
                            <AddProduct
                                isWine={false}
                                classNames='mb-6 mx-auto bg-lightBg'
                                itemData={{
                                    id: item.id,
                                    title: item.name,
                                    price: item.price,
                                    weight: 120,
                                    desc: item.description,
                                    isSelected: false,
                                    quantity: 0,
                                }}
                            />
                        </CardContainer>
                    ))}
            </ScrollArea>
        </Container>
    )
}
