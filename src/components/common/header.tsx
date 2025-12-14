"use client"

import IconBack from "#/public/svg/icons/IconBack"
import { useTranslations } from "next-intl"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LanguageSwitcher } from "./language-switcher"

const Header = ({ className }: { className?: string }) => {
    const router: AppRouterInstance = useRouter()
    const pathname = usePathname()
    const t = useTranslations("navigation")

    const onBack = () => router?.back()

    // Map pathnames to translation keys
    const getHeaderTitle = (path: string): string | null => {
        switch (path) {
            case "/":
                return t("menu")
            case "/cart":
                return t("mySelection")
            case "/order":
                return t("payment")
            case "/payment":
                return t("payment")
            default:
                return null
        }
    }

    const headerTitle = getHeaderTitle(pathname)

    return (
        <div className={`bg-lightBg flex max-h-12 min-w-full items-center justify-between p-4 shadow-md ${className}`}>
            <div
                onClick={onBack}
                className='text-white hover:cursor-pointer'
            >
                <IconBack />
            </div>
            {headerTitle ? (
                <p>{headerTitle}</p>
            ) : (
                <Image
                    src='/images/logo.png'
                    width={110}
                    height={80}
                    alt='logo'
                />
            )}

            <div className='text-white'>
                <LanguageSwitcher />
            </div>
        </div>
    )
}

export default Header
