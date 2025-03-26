import Link from "next/link"
import IconArrowRight from "../../../public/svg/icons/IconArrowRight"

interface MenuItemProps {
    name: string
    catQuantity: number
    id: string
    type: string
    productId?: string
    isWine: boolean
}

const MenuItem = ({ name, catQuantity, id, type, productId, isWine }: MenuItemProps) => {
    const buildUrl = () => {
        if (productId) return `/subcategory/${type}/${id}?productId=${productId}&isWine=${isWine}`
        return `/subcategory/${type}/${id}?isWine=${isWine}`
    }

    return (
        <Link href={buildUrl()}>
            <div className='border-b-seperator flex flex-1 justify-between border-b-[1px] py-1'>
                <p className='capitalize'>{name ?? "[Empty]"}</p>
                <div className='flex items-center gap-3'>
                    <p className={`${isWine ? "text-wine-light" : "text-yellow"}`}>{catQuantity}</p>
                    <IconArrowRight />
                </div>
            </div>
        </Link>
    )
}

export default MenuItem
