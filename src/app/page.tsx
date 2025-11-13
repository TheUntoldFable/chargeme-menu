"use client"

import IconFailed from "#/public/svg/icons/IconFailed"
import IconSuccess from "#/public/svg/icons/IconSuccess"
import CategoriesCard from "@/components/Category/CategoriesCard"
import Center from "@/components/common/Center"
import DialogPopUp from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCategories } from "@/hooks/get-categories"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
    const searchParams = useSearchParams()
    const restaurantIdParam = searchParams.get("restaurantId") ?? ""
    const isPaidParam = searchParams.get("isPaid")
    const [isOpenSuccessDialog, setIsOpenSuccesDialog] = useState(false)
    const [isOpenFailedDialog, setIsOpenFailedDialog] = useState(false)
    const tPayment = useTranslations("payment")
    const tCommon = useTranslations("common")

    const router = useRouter()
    const pathname = usePathname()
    const nextSearchParams = new URLSearchParams(searchParams.toString())
    const { data: categories, isLoading, status } = useCategories(restaurantIdParam)

    const handleAccept = () => {
        setIsOpenSuccesDialog(false)
        setIsOpenFailedDialog(false)
    }

    useEffect(() => {
        if (isPaidParam === "true") {
            setIsOpenSuccesDialog(true)
            nextSearchParams.delete("isPaid")
            router.replace(`${pathname}?${nextSearchParams}`)
        }
    }, [isPaidParam])

    return (
        <main>
            <DialogPopUp
                icon={<IconSuccess />}
                title={tPayment("success.title")}
                description={tPayment("success.description")}
                defaultTitle={tCommon("ok")}
                isOpen={isOpenSuccessDialog}
                onConfirm={handleAccept}
            />
            <DialogPopUp
                icon={<IconFailed />}
                title={tPayment("failed.title")}
                description={tPayment("failed.description")}
                defaultTitle={tCommon("ok")}
                isOpen={isOpenFailedDialog}
                onConfirm={handleAccept}
            />
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
