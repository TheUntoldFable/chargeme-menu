"use client"

import IconMenu from "#/public/svg/icons/IconMenu"
import IconSoup from "#/public/svg/icons/IconSoup"
import IconWallet from "#/public/svg/icons/IconWallet"
import { Badge } from "@/components/ui/badge"
import { usePrePay } from "@/context/PrePayContext"
import { useTranslations } from "next-intl"
import { useRestaurantParams, withRestaurantParams } from "@/lib/navigation-utils"
import { cartState } from "@/store/cart"
import { orderState } from "@/store/order"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRecoilValue } from "recoil"

interface BottomNavigationProps {
    classNames?: string
}

export default function BottomNavigation({ classNames }: BottomNavigationProps) {
    const cartItems = useRecoilValue(cartState)
    const order = useRecoilValue(orderState)
    const cartItemsLength = cartItems.length
    const orderItemsLength = order?.orderItems?.length
    const currentPath = usePathname()
    const { restaurantData } = usePrePay()
    const { restaurantId, table } = useRestaurantParams()
    const t = useTranslations("navigation")

    const isPrePayMode = restaurantData?.paymentInAdvance || false

    const getLinkClasses = (path: string) => {
        return currentPath === path ? "text-yellow" : "text-white"
    }

    const getIconColor = (path: string) => {
        return currentPath === path ? "#E9C500" : "#FFF"
    }

    return (
        <div
            className={`mb-0 mt-auto flex h-20 min-w-full items-center shadow-top-lg ${!isPrePayMode ? "justify-between" : "justify-around"} bg-darkGray px-4 py-4 ${classNames} fixed bottom-0`}
        >
            <Link href={withRestaurantParams("/", restaurantId, table)}>
                <div className='flex flex-col items-center'>
                    <IconMenu color={getIconColor("/")} />
                    <p className={`bold text-sm ${getLinkClasses("/")}`}>{t("menu")}</p>
                </div>
            </Link>
            <Link href={withRestaurantParams("/cart", restaurantId, table)}>
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
                <Link href={withRestaurantParams("/order", restaurantId, table)}>
                    <div className='relative flex flex-col items-center'>
                        {!!orderItemsLength && (
                            <Badge
                                variant='destructive'
                                className='absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-1'
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
