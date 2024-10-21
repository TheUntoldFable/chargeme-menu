"use client"

import { Badge } from "@/components/ui/badge"
import { cartState } from "@/store/cart"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import IconMenu from "../../../public/svg/IconMenu"
import IconSoup from "../../../public/svg/IconSoup"
import IconWallet from "../../../public/svg/IconWallet"

interface BottomNavigationProps {
    classNames?: string
}

export default function BottomNavigation({ classNames }: BottomNavigationProps) {
    const cartItems = useRecoilValue(cartState)
    const cartItemsLength = useMemo(() => cartItems.length, [cartItems.length])
    const currentPath = usePathname()

    const getLinkClasses = (path: string) => {
        return currentPath === path ? "text-yellow" : "text-white"
    }

    const getIconColor = (path: string) => {
        return currentPath === path ? "#E9C500" : "#FFF"
    }

    return (
        <div className={`flex h-20 min-w-full items-center justify-between bg-black px-8 py-4 ${classNames}`}>
            <Link href='/'>
                <div className='flex flex-col items-center'>
                    <IconMenu color={getIconColor("/")} />
                    <p className={`bold text-sm ${getLinkClasses("/")}`}>Меню</p>
                </div>
            </Link>
            <Link href='/order'>
                <div className='relative flex flex-col items-center'>
                    <Badge
                        variant='destructive'
                        className='absolute -top-2 right-1 flex h-5 w-5 items-center justify-center rounded-full p-1'
                    >
                        {cartItemsLength}
                    </Badge>
                    <IconSoup color={getIconColor("/order")} />
                    <p className={`bold text-sm ${getLinkClasses("/order")}`}>Моят избор</p>
                </div>
            </Link>
            <Link href='/cart'>
                <div className='flex flex-col items-center'>
                    <IconWallet color={getIconColor("/cart")} />
                    <p className={`bold text-sm ${getLinkClasses("/cart")}`}>Плащане</p>
                </div>
            </Link>
        </div>
    )
}
