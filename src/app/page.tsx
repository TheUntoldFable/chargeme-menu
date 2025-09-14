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
import { useState } from "react"

export default function Home() {
    const [isOpenSuccessDialog, setIsOpenSuccesDialog] = useState(false)
    const [isOpenFailedDialog, setIsOpenFailedDialog] = useState(false)

    const { data: categories, isLoading, status } = useCategories()

    const handleAccept = () => {
        setIsOpenSuccesDialog(false)
        setIsOpenFailedDialog(false)
    }

    return (
        <main>
            <DialogPopUp
                icon={<IconSuccess />}
                title='Успешно плащане!'
                description='Благодарим Ви, че избрахте нас, очакваме ви отново скоро!'
                defaultTitle='Ok'
                isOpen={isOpenSuccessDialog}
                onConfirm={handleAccept}
            />
            <DialogPopUp
                icon={<IconFailed />}
                title='Неуспешно плащане!'
                description='Възникна грешка по време на плащането, моля опитайте пак.'
                defaultTitle='Ok'
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
