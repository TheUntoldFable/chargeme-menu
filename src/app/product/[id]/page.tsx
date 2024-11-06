"use client"

import Container from "@/components/common/container"
import { DropdownMenuCheckboxes } from "@/components/common/dropdown-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import IconMinus from "../../../../public/svg/IconMinus"
import IconPlus from "../../../../public/svg/IconPlus"

export default function Page() {
    return (
        <Container title='Плащане'>
            <Image
                src='/images/pizza.png'
                width={393}
                height={248}
                className='mb-6 h-60 w-full rounded'
                alt='Img'
            />{" "}
            <div className='w-full px-4 pb-4'>
                <div className='mb-6 flex items-center justify-between rounded-2xl bg-lightBg py-2 pl-4 pr-2'>
                    <p className='text-lightGray'>
                        Крайна цена: <span className='text-white'>12,99лв</span>
                    </p>
                    <div className='flex w-1/4 items-center justify-between rounded-xl bg-gray p-2 text-white'>
                        <div className='flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-yellowNew bg-transparent'>
                            <IconMinus />
                        </div>
                        1
                        <div className='cursor-pointer rounded-full bg-yellow p-1'>
                            <IconPlus color='black' />
                        </div>
                    </div>
                </div>
                <h2 className='mb-1 text-left text-white'>Описание</h2>
                <p className='mb-6 text-sm text-lightGray'>Български черен трюфел, горски печурки и моцарела</p>
                <DropdownMenuCheckboxes></DropdownMenuCheckboxes>
                <DropdownMenuCheckboxes></DropdownMenuCheckboxes>
                <h2 className='mb-3 text-left text-white'>Алергени</h2>
                <div className='mb-6 flex gap-2'>
                    <Image
                        src='/images/allergens-1.png'
                        width={24}
                        height={24}
                        className='h-6'
                        alt='Img'
                    />
                    <Image
                        src='/images/allergens-2.png'
                        width={24}
                        height={24}
                        className='h-6'
                        alt='Img'
                    />
                    <Image
                        src='/images/allergens-3.png'
                        width={24}
                        height={24}
                        className='h-6'
                        alt='Img'
                    />
                    <Image
                        src='/images/allergens-4.png'
                        width={24}
                        height={24}
                        className='h-6'
                        alt='Img'
                    />
                </div>

                <Button
                    className='w-full flex-1 gap-2 rounded-xl bg-yellowNew py-4 text-lg'
                    type='button'
                    id='price'
                    variant='default'
                >
                    Добави
                </Button>
            </div>
        </Container>
    )
}
