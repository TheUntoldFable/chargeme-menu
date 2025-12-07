"use client"

import IconFailed from "#/public/svg/icons/IconFailed"
import IconSuccess from "#/public/svg/icons/IconSuccess"
import CategoriesCard from "@/components/Category/CategoriesCard"
import Center from "@/components/common/Center"
import { DialogPopUp } from "@/components/common/DialogPopUp"
import Container from "@/components/common/container"
import { Loader } from "@/components/ui/loader"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useCategories } from "@/hooks/get-categories"
import { Rating as ReactRating } from "@smastrom/react-rating"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function Home() {
    const searchParams = useSearchParams()
    const restaurantIdParam = searchParams.get("restaurantId") ?? ""
    const isPaidParam = searchParams.get("isPaid")
    const [isOpenSuccessDialog, setIsOpenSuccesDialog] = useState(false)
    const [isOpenFailedDialog, setIsOpenFailedDialog] = useState(false)
    const [rating, setRating] = useState(0)
    const [shouldRate, setShouldRate] = useState(false)
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const tPayment = useTranslations("payment")
    const tCommon = useTranslations("common")

    const router = useRouter()
    const pathname = usePathname()
    const nextSearchParams = new URLSearchParams(searchParams.toString())
    const { data: categories, isLoading, status } = useCategories(restaurantIdParam)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const handleAccept = () => {
        setIsOpenSuccesDialog(false)
        setIsOpenFailedDialog(false)
        setShouldRate(true)
    }

    const handleSetRating = (rating: number) => {
        setRating(rating)
        setShouldRate(false)
        setFeedbackOpen(true)
    }

    const onSubmit = (data: any) => {
        console.log(data)
    }

    useEffect(() => {
        if (isPaidParam === "true") {
            setIsOpenSuccesDialog(true)
            nextSearchParams.delete("isPaid")
            router.replace(`${pathname}?${nextSearchParams}`)
        }
    }, [isPaidParam])

    const Star = (
        <svg
            width='34'
            height='34'
        >
            <g clipPath='url(#a)'>
                <path
                    fill='#24252A'
                    d='M0 0h33.871v33.871H0z'
                />
                <path
                    stroke='#E9C500'
                    strokeWidth='2.2'
                    d='M26.064 31.754c-.223 0-.44-.069-.621-.199l-8.508-6.168-8.508 6.168a1.058 1.058 0 0 1-1.624-1.195l3.318-9.83-8.6-5.897a1.058 1.058 0 0 1 .595-1.931h10.61l3.202-9.854a1.059 1.059 0 0 1 2.014 0l3.202 9.857h10.61a1.058 1.058 0 0 1 .598 1.931l-8.603 5.895 3.316 9.826a1.057 1.057 0 0 1-1 1.397Z'
                />
            </g>
        </svg>
    )

    const customStyles = {
        itemShapes: Star,
        activeFillColor: "#E9C500",
        inactiveFillColor: "#24252A",
    }

    return (
        <main>
            <DialogPopUp
                title='Добавяне на отзив'
                description={
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Textarea
                            className='bg-lightBg'
                            id='checkout-7j9-optional-comments'
                            placeholder='Вкусна храна'
                            {...register("textArea", { required: true })}
                        />

                        {errors.textArea && <span>This field is required</span>}
                    </form>
                }
                isOpen={feedbackOpen}
                defaultTitle='Добави'
                cancelTitle='Пропусни'
                shouldConfirm
                onConfirm={() => {
                    setFeedbackOpen(false)
                }}
                onCancel={() => {
                    setFeedbackOpen(false)
                }}
            />
            <DialogPopUp
                title='Лесно ли се ориентирахте в приложението?'
                description={
                    <ReactRating
                        value={rating}
                        onChange={handleSetRating}
                        itemStyles={customStyles}
                    />
                }
                defaultTitle='Пропусни'
                isOpen={shouldRate}
                onConfirm={() => {
                    setShouldRate(false)
                    setFeedbackOpen(true)
                }}
            />
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
