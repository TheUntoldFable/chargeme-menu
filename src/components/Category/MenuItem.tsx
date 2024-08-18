import Link from "next/link"
import IconArrowRight from "../../../public/svg/IconArrowRight"

interface MenuItemProps {
    name: string
    catQuantity: number
    id: string
    type: string
    productId?: string
}

const MenuItem = ({ name, catQuantity, id, type, productId }: MenuItemProps) => {
    const buildUrl = () => {
        if (productId) return `/subcategory/${type}/${id}?productId=${productId}`
        return `/subcategory/${type}/${id}`
    }

    return (
        <Link href={buildUrl()}>
            <div className='flex flex-1 justify-between border-b-defaultGray border-b-[1px] py-1'>
                <p className='capitalize '>{name ?? "[Empty]"}</p>
                <div className='flex items-center gap-3'>
                    <p className='text-yellow'>{catQuantity}</p>
                    <IconArrowRight />
                </div>
            </div>
        </Link>
    )
}

export default MenuItem
