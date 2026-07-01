"use client"

import IconMinus from "#/public/svg/icons/IconMinus"
import IconPlus from "#/public/svg/icons/IconPlus"
import Container from "@/components/common/container"
import { DropdownMenuCheckboxes } from "@/components/common/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMenuItem } from "@/hooks/get-menu-item"
import { useAddToCart } from "@/hooks/use-add-to-cart"
import { Product } from "@/models/product"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { use, useState } from "react"

interface ProductPageProps {
    params: Promise<{ id: string }>
}

// TODO: Split to components/component
export default function Page({ params }: ProductPageProps) {
    const { id } = use(params)
    const { data: item, isLoading } = useMenuItem(id)
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useAddToCart()
    const t = useTranslations("product")
    const tCommon = useTranslations("common")

    return (
        !isLoading && (
            <Container title={item?.name || ""}>
                <ScrollArea className='calc-height h-screen min-w-full px-4 pt-4'>
                    <Image
                        src={item?.image ?? "/images/coming-soon.png"}
                        width={393}
                        height={248}
                        className='mb-6 h-60 w-full rounded object-contain'
                        alt='Img'
                    />
                    <div className='w-full px-4 pb-4'>
                        <div className='bg-lightBg mb-6 flex items-center justify-between rounded-2xl py-2 pr-2 pl-4'>
                            <p className='text-lightGray'>
                                {t("finalPrice")}{" "}
                                <span className='block text-white'>
                                    {item
                                        ? `${item.priceInBgn.toFixed(2)} ${tCommon("currency")}${item.priceInEur !== undefined ? ` / €${item.priceInEur.toFixed(2)}` : ""}`
                                        : ""}
                                </span>
                            </p>
                            <div className='bg-gray flex w-1/3 items-center justify-between rounded-xl px-3 py-2 text-white'>
                                <div className='border-yellowNew flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border bg-transparent'>
                                    <IconMinus onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))} />
                                </div>
                                {quantity}
                                <div className='bg-yellow cursor-pointer rounded-full p-1'>
                                    <IconPlus
                                        color='black'
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                    />
                                </div>
                            </div>
                        </div>
                        <h2 className='mb-1 text-left text-white'>{t("description")}</h2>
                        <p className='text-lightGray mb-6 text-sm'>{item?.description}</p>
                        <DropdownMenuCheckboxes></DropdownMenuCheckboxes>
                        <DropdownMenuCheckboxes></DropdownMenuCheckboxes>
                        <h2 className='mb-3 text-left text-white'>{t("allergens")}</h2>
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
                            className='bg-yellowNew w-full flex-1 gap-2 rounded-xl py-4 text-lg'
                            type='button'
                            id='price'
                            variant='default'
                            onClick={() => addToCart(item as Product, item?.name, quantity)}
                        >
                            {t("add")}
                        </Button>
                    </div>
                </ScrollArea>
            </Container>
        )
    )
}
