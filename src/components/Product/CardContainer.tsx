import { Card, CardContent } from "@/components/ui/card"
import { getRestaurantParamsFromWindow, withRestaurantParams } from "@/lib/navigation-utils"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
    productId: string
    classNames?: string
    isWine: boolean
    children?: React.ReactNode
    isBlocked: boolean
    image: string
}

const ProductCard = ({ productId, classNames, children, isBlocked, image }: ProductCardProps) => {
    const RenderCard = () => (
        <Card className={`flex flex-col justify-center rounded-2xl border-0 bg-lightBg ${classNames}`}>
            <CardContent className='flex w-full rounded-lg p-0'>
                <Image
                    src={image ? image : "/images/pizza.png"}
                    width={96}
                    height={96}
                    className='h-24 w-24 rounded-s-2xl object-contain'
                    alt='Img'
                />
                <div className='p2 flex min-w-0 flex-1 flex-row items-center justify-between px-4'>{children}</div>
            </CardContent>
        </Card>
    )

    return (
        <>
            {isBlocked ? (
                <RenderCard />
            ) : (
                <Link
                    href={(() => {
                        const { restaurantId, table } = getRestaurantParamsFromWindow()
                        return withRestaurantParams(`/product/${productId}`, restaurantId, table)
                    })()}
                    passHref
                >
                    <RenderCard />
                </Link>
            )}
        </>
    )
}

export default ProductCard
