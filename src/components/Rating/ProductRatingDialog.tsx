"use client"

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Product } from "@/models/product"
import { Rating as ReactRating } from "@smastrom/react-rating"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FC, useState } from "react"

interface ProductRatingDialogProps {
    isOpen: boolean
    product: Product
    onSubmit: (rating: number, feedback: string) => void
    onSkip: () => void
}

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

export const ProductRatingDialog: FC<ProductRatingDialogProps> = ({ isOpen, product, onSubmit, onSkip }) => {
    const t = useTranslations("order.ratingDialog")
    const [rating, setRating] = useState(0)
    const [feedback, setFeedback] = useState("")

    const handleSubmit = () => {
        onSubmit(rating, feedback)
        setRating(0)
        setFeedback("")
    }

    const handleSkip = () => {
        setRating(0)
        setFeedback("")
        onSkip()
    }

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className='bg-lightBg max-w-[90%] rounded-lg border-0'>
                <div className='flex justify-center'>
                    <Image
                        className='resize-contain rounded-lg'
                        src={product.image}
                        alt={product.name}
                        width={100}
                        height={100}
                    />
                </div>
                <div className='flex flex-1 flex-col items-center p-2'>
                    <AlertDialogHeader className='items-center'>
                        <AlertDialogTitle className='text-center text-white'>{t("title", { productName: product.name })}</AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className='flex justify-center py-2'>
                        <ReactRating
                            style={{ maxWidth: 200 }}
                            value={rating}
                            onChange={setRating}
                            itemStyles={customStyles}
                        />
                    </div>
                </div>

                <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t("feedbackPlaceholder")}
                    className='bg-lighterGray placeholder:text-lightGray resize-none border-0 text-white'
                    rows={3}
                />

                <AlertDialogFooter className='flex-row items-center'>
                    <div className='flex-1 flex-col'>
                        <Button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            className='bg-yellowNew mb-2 w-full rounded-2xl disabled:opacity-50'
                            variant='default'
                        >
                            {t("submit")}
                        </Button>
                        <Button
                            onClick={handleSkip}
                            className='bg-lighterGray w-full rounded-2xl'
                            variant='default'
                        >
                            {t("skip")}
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
