"use client"

import IconBack from "#/public/svg/icons/IconBack"
import IconFood from "#/public/svg/icons/IconFood"
import { HeaderName, HeaderNameStrings } from "@/models/header"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

const Header = ({ className }: { className?: string }) => {
    const router: AppRouterInstance = useRouter()
    const pathname = usePathname()

    const onBack = () => router?.back()

    return (
        <div className={`flex max-h-12 min-w-full items-center justify-between bg-lightBg p-4 ${className}`}>
            <div
                onClick={onBack}
                className='text-white hover:cursor-pointer'
            >
                <IconBack />
            </div>
            {HeaderName[pathname as HeaderNameStrings] ? (
                <p>{HeaderName[pathname as HeaderNameStrings]}</p>
            ) : (
                <Image
                    src='/images/logo.png'
                    width={110}
                    height={80}
                    alt='logo'
                />
            )}

            <div className='text-white'>
                {/*//TODO: In the future this icon should be dynamic depending on routePath*/}
                <IconFood />
            </div>
        </div>
    )
}

export default Header
