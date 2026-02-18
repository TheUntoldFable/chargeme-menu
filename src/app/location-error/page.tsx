"use client"

import Container from "@/components/common/container"
import { useLocation } from "@/components/providers/location-provider"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

export default function LocationError() {
    const { checkLocation, isChecking } = useLocation()
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const t = useTranslations("location.error")

    const handleCheckLocation = async () => {
        setIsButtonDisabled(true)

        // Add 1 second timeout before actually checking
        setTimeout(async () => {
            await checkLocation()
            setIsButtonDisabled(false)
        }, 1000)
    }

    return (
        <Container title=''>
            <div className='flex h-full w-full flex-col items-center justify-center px-4'>
                <div className='flex flex-col items-center gap-6 text-center'>
                    <div className='bg-lightBg rounded-full p-6'>
                        <MapPin className='h-12 w-12 text-white' />
                    </div>

                    <h1 className='text-2xl font-semibold text-white'>{t("title")}</h1>

                    <p className='text-sm text-gray-400'>{t("description")}</p>

                    <Button
                        onClick={handleCheckLocation}
                        disabled={isChecking || isButtonDisabled}
                        className='bg-lightBg gap-2 px-6 py-3 text-base font-medium text-white transition-transform ease-in-out active:scale-75'
                        variant='default'
                    >
                        {isChecking || isButtonDisabled ? t("checking") : t("checkAgain")}
                    </Button>
                </div>
            </div>
        </Container>
    )
}
