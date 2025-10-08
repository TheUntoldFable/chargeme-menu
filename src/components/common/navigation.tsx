"use client"

import IconMenu from "#/public/svg/icons/IconMenu"
import IconSoup from "#/public/svg/icons/IconSoup"
import IconWallet from "#/public/svg/icons/IconWallet"
import { Badge } from "@/components/ui/badge"
import { usePrePay } from "@/context/PrePayContext"
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

    const isPrePayMode = restaurantData?.paymentInAdvance || false

    const getLinkClasses = (path: string) => {
        return currentPath === path ? "text-yellow" : "text-white"
    }

    const getIconColor = (path: string) => {
        return currentPath === path ? "#E9C500" : "#FFF"
    }

    return (
        <div
            className={`shadow-top-lg mb-0 mt-auto flex h-20 min-w-full items-center ${!isPrePayMode ? "justify-between" : "justify-around"} bg-darkGray px-4 py-4 ${classNames} fixed bottom-0`}
        >
            <Link href='/'>
                <div className='flex flex-col items-center'>
                    <IconMenu color={getIconColor("/")} />
                    <p className={`bold text-sm ${getLinkClasses("/")}`}>Меню</p>
                </div>
            </Link>
            <Link href='/cart'>
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
                    <p className={`bold text-sm ${getLinkClasses("/cart")}`}>Моят избор</p>
                </div>
            </Link>
            {!isPrePayMode && (
                <Link href='/order'>
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
                        <p className={`bold text-sm ${getLinkClasses("/order")}`}>Плащане</p>
                    </div>
                </Link>
            )}
        </div>
    )
}
