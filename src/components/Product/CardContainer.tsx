import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
    productId: string
    classNames?: string
    isWine: boolean
    children?: React.ReactNode
    isBlocked: boolean
}

const ProductCard = ({ productId, classNames, children, isBlocked }: ProductCardProps) => {
    const RenderCard = () => (
        <Card className={`flex flex-col justify-center rounded-2xl border-0 bg-lightBg ${classNames}`}>
            <CardContent className='flex w-full rounded-lg p-0'>
                <Image
                    src='/images/pizza.png'
                    width={96}
                    height={96}
                    className='h-24 w-24 rounded-s-2xl'
                    alt='Img'
                />
                <div className='p2 flex flex-1 flex-row items-center justify-between gap-4 px-4'>{children}</div>
            </CardContent>
        </Card>
    )

    return (
        <>
            {isBlocked ? (
                <RenderCard />
            ) : (
                <Link
                    href={`/product/${productId}`}
                    passHref
                >
                    <RenderCard />
                </Link>
            )}
        </>
    )
}

export default ProductCard
