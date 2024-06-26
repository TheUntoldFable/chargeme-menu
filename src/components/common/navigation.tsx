"use client"

import { Badge } from "@/components/ui/badge"
import { cartState } from "@/store/cart"
import Link from "next/link"
import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import IconFeedback from "../../../public/svg/IconFeedback"
import IconSoup from "../../../public/svg/IconSoup"
import IconWallet from "../../../public/svg/IconWallet"

interface BottomNavigationProps {
  classNames?: string
}

export default function BottomNavigation({ classNames }: BottomNavigationProps) {
  const cartItems = useRecoilValue(cartState)
  const cartItemsLength = useMemo(() => cartItems.length, [cartItems.length])

  return (
    <div className={`flex min-w-full justify-between items-center h-20 bg-black px-8 py-4  ${classNames}`}>
      <Link href='/'>
        <div className='flex flex-col items-center'>
          <IconSoup />
          <p className='text-sm bold'>Меню</p>
        </div>
      </Link>
      <Link href='/order'>
        <div className='relative flex flex-col items-center'>
          <Badge variant='destructive' className='absolute -top-2 right-1 rounded-full w-5 h-5 p-1 flex justify-center items-center'>
            {cartItemsLength}
          </Badge>
          <IconSoup />
          <p className='text-sm bold'>Моят избор</p>
        </div>
      </Link>
      <Link href='/cart'>
        <div className='flex flex-col items-center'>
          <IconWallet />
          <p className='text-sm bold'>Плащане</p>
        </div>
      </Link>
      <Link href='/'>
        <div className='flex flex-col items-center'>
          <IconFeedback />
          <p className='text-sm bold'>Оценете ни</p>
        </div>
      </Link>
    </div>
  )
}
