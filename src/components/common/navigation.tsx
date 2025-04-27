"use client"

import { Badge } from "@/components/ui/badge"
import { cartState } from "@/store/cart"
import { orderState } from "@/store/order"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import IconMenu from "../../../public/svg/icons/IconMenu"
import IconSoup from "../../../public/svg/icons/IconSoup"
import IconWallet from "../../../public/svg/icons/IconWallet"

interface BottomNavigationProps {
    classNames?: string
}

export default function BottomNavigation({ classNames }: BottomNavigationProps) {
    const cartItems = useRecoilValue(cartState)
    const orderItems = useRecoilValue(orderState)
    const [isHydrated, setIsHydrated] = useState(false)
    const cartItemsLength = cartItems.length
    const orderItemsLength = orderItems.orderItems.length
    const currentPath = usePathname()

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    const getLinkClasses = (path: string) => {
        return currentPath === path ? "text-yellow" : "text-white"
    }

    const getIconColor = (path: string) => {
        return currentPath === path ? "#E9C500" : "#FFF"
    }

    if (!isHydrated) {
        return null
    }

    return (
        <div className={`mb-0 mt-auto flex h-20 min-w-full items-center justify-between bg-black px-4 py-4 ${classNames} fixed bottom-0`}>
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
        </div>
    )
}
