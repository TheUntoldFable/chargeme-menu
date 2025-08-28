"use client"

import Container from "@/components/common/container"
import { useLocation } from "@/components/providers/location-provider"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { useState } from "react"

export default function LocationError() {
    const { checkLocation, isChecking } = useLocation()
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

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
            <div className='flex h-screen flex-col items-center justify-center px-4'>
                <div className='flex flex-col items-center gap-6 text-center'>
                    <div className='rounded-full bg-lightBg p-6'>
                        <MapPin className='h-12 w-12 text-white' />
                    </div>

                    <h1 className='text-2xl font-semibold text-white'>Моля сканирайте QR кода отново.</h1>

                    <p className='text-gray-400 text-sm'>Трябва да сте в ресторанта, за да направите поръчка</p>

                    <Button
                        onClick={handleCheckLocation}
                        disabled={isChecking || isButtonDisabled}
                        className='gap-2 bg-lightBg px-6 py-3 text-base font-medium text-white transition-transform ease-in-out active:scale-75'
                        variant='default'
                    >
                        {isChecking || isButtonDisabled ? "Проверява се..." : "Провери отново"}
                    </Button>
                </div>
            </div>
        </Container>
    )
}
