"use client"

import { Badge } from "@/components/ui/badge"
import { cartState } from "@/store/cart"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import IconFeedback from "../../../public/svg/icons/IconFeedback"
import IconMenu from "../../../public/svg/icons/IconMenu"
import IconSoup from "../../../public/svg/icons/IconSoup"
import IconWallet from "../../../public/svg/icons/IconWallet"

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
        <div className={`flex mt-auto mb-0 min-w-full justify-between items-center h-20 bg-black px-2 py-4  ${classNames}`}>
            <Link href='/'>
                <div className='flex flex-col items-center'>
                    <IconMenu color={getIconColor("/")} />
                    <p className={`text-sm bold ${getLinkClasses("/")}`}>Меню</p>
                </div>
            </Link>
            <Link href='/cart'>
                <div className='relative flex flex-col items-center'>
                    <Badge
                        variant='destructive'
                        className='absolute -top-2 right-1 rounded-full w-5 h-5 p-1 flex justify-center items-center'
                    >
                        {cartItemsLength}
                    </Badge>
                    <IconSoup color={getIconColor("/cart")} />
                    <p className={`text-sm bold ${getLinkClasses("/cart")}`}>Моят избор</p>
                </div>
            </Link>
            <Link href='/order'>
                <div className='flex flex-col items-center'>
                    <IconWallet color={getIconColor("/order")} />
                    <p className={`text-sm bold ${getLinkClasses("/order")}`}>Плащане</p>
                </div>
            </Link>
            <Link href='/'>
                <div className='flex flex-col items-center'>
                    <IconFeedback color={getIconColor("/feedback")} />
                    <p className={`text-sm bold ${getLinkClasses("/feedback")}`}>Оценете ни</p>
                </div>
            </Link>
        </div>
    )
}
