"use client"

import Container from "@/components/common/container"
import { DropdownMenuCheckboxes } from "@/components/common/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useMenuItem } from "@/hooks/get-menu-item"
import { useAddToCart } from "@/hooks/useAddToCart"
import { Product } from "@/models/product"
import Image from "next/image"
import { useState } from "react"
import IconMinus from "../../../../public/svg/IconMinus"
import IconPlus from "../../../../public/svg/IconPlus"

interface ProductPageProps {
    params: { id: string }
}

// TODO: Split to components/component
export default function Page({ params }: ProductPageProps) {
    const { id } = params
    const { data: item, isLoading } = useMenuItem(id)
    const [quantity, setQuantity] = useState(1)
    const { addToCart, isAddBtnActive } = useAddToCart()

    return (
        !isLoading && (
            <Container title={item?.name || ""}>
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
                            Крайна цена: <span className='text-white'>{item?.price}лв</span>
                        </p>
                        <div className='flex w-1/4 items-center justify-between rounded-xl bg-gray px-3 py-2 text-white'>
                            <div className='flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-yellowNew bg-transparent'>
                                <IconMinus onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))} />
                            </div>
                            {quantity}
                            <div className='cursor-pointer rounded-full bg-yellow p-1'>
                                <IconPlus
                                    color='black'
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className='mb-1 text-left text-white'>Описание</h2>
                    <p className='mb-6 text-sm text-lightGray'>{item?.description}</p>
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
                        onClick={() => addToCart(item as Product, item?.name, quantity)}
                    >
                        Добави
                    </Button>
                </div>
            </Container>
        )
    )
}
