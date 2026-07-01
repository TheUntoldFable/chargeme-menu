"use client"

import IconMenu from "#/public/svg/icons/IconMenu"
import IconSoup from "#/public/svg/icons/IconSoup"
import IconWallet from "#/public/svg/icons/IconWallet"
import { Badge } from "@/components/ui/badge"
import { usePrePay } from "@/context/PrePayContext"
import { useBusinessParams, withBusinessParams } from "@/lib/navigation-utils"
import { useCartStore } from "@/store/cart"
import { useOrderStore } from "@/store/order"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface BottomNavigationProps {
    classNames?: string
}

export default function BottomNavigation({ classNames }: BottomNavigationProps) {
    const cartItems = useCartStore((state) => state.items)
    const orderItems = useOrderStore((state) => state.orderItems)
    const cartItemsLength = cartItems.length
    const orderItemsLength = orderItems?.length
    const currentPath = usePathname()
    const { businessData } = usePrePay()
    const { businessId, table } = useBusinessParams()
    const t = useTranslations("navigation")

    const isPrePayMode = businessData?.paymentInAdvance || false

    const getLinkClasses = (path: string) => {
        return currentPath === path ? "text-yellow" : "text-white"
    }

    const getIconColor = (path: string) => {
        return currentPath === path ? "#E9C500" : "#FFF"
    }

    return (
        <div
            className={`shadow-top-lg mt-auto mb-0 flex h-20 min-w-full items-center ${!isPrePayMode ? "justify-between" : "justify-around"} bg-darkGray px-4 py-4 ${classNames} fixed bottom-0`}
        >
            <Link href={withBusinessParams("/", businessId, table)}>
                <div className='flex flex-col items-center'>
                    <IconMenu color={getIconColor("/")} />
                    <p className={`bold text-sm ${getLinkClasses("/")}`}>{t("menu")}</p>
                </div>
            </Link>
            <Link href={withBusinessParams("/cart", businessId, table)}>
                <div className='relative flex flex-col items-center'>
                    {!!cartItemsLength && (
                        <Badge
                            variant='destructive'
                            className='absolute -top-2 right-1 flex h-5 w-5 items-center justify-center rounded-full p-1'
                        >
                            {cartItemsLength}
                        </Badge>
                    )}
                    <IconSoup color={getIconColor("/cart")} />
                    <p className={`bold text-sm ${getLinkClasses("/cart")}`}>{t("mySelection")}</p>
                </div>
            </Link>
            {!isPrePayMode && (
                <Link href={withBusinessParams("/order", businessId, table)}>
                    <div className='relative flex flex-col items-center'>
                        {!!orderItemsLength && (
                            <Badge
                                variant='destructive'
                                className='absolute -top-2 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-1'
                            >
                                {orderItemsLength}
                            </Badge>
                        )}

                        <IconWallet color={getIconColor("/order")} />
                        <p className={`bold text-sm ${getLinkClasses("/order")}`}>{t("payment")}</p>
                    </div>
                </Link>
            )}
        </div>
    )
}
