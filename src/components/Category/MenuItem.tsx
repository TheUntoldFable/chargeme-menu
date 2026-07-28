import IconArrowRight from "#/public/svg/icons/IconArrowRight"
import { buildUrlWithParams, useBusinessParams } from "@/lib/navigation-utils"
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
    const { businessId, table, param } = useBusinessParams()
    const t = useTranslations("common")
    const buildUrl = () => {
        return buildUrlWithParams(
            `/subcategory/${type}/${id}`,
            {
                isWine,
                productId: productId || null,
            },
            businessId,
            table,
            param
        )
    }

    return (
        <Link href={buildUrl()}>
            <div className='border-b-seperator flex flex-1 justify-between border-b-[1px] py-1'>
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
