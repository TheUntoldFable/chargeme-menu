import IconArrowRight from "#/public/svg/icons/IconArrowRight"
import { buildUrlWithParams, useRestaurantParams } from "@/lib/navigation-utils"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface MenuItemProps {
    name: string
    catQuantity: number
    id: string
    type: string
    productId?: string
    isWine: boolean
}

const MenuItem = ({ name, catQuantity, id, type, productId, isWine }: MenuItemProps) => {
    const { restaurantId, table } = useRestaurantParams()
    const t = useTranslations("common")
    const buildUrl = () => {
        return buildUrlWithParams(
            `/subcategory/${type}/${id}`,
            {
                isWine,
                productId: productId || null,
            },
            restaurantId,
            table
        )
    }

    return (
        <Link href={buildUrl()}>
            <div className='flex flex-1 justify-between border-b-[1px] border-b-seperator py-1'>
                <p className='capitalize'>{name ?? t("empty")}</p>
                <div className='flex items-center gap-3'>
                    <p className={`${isWine ? "text-wine-light" : "text-yellow"}`}>{catQuantity}</p>
                    <IconArrowRight />
                </div>
            </div>
        </Link>
    )
}

export default MenuItem
