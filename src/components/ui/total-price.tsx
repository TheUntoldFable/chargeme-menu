import { Card, CardContent } from "@/components/ui/card"
import { calculateTotalPrice } from "@/lib/utils"
import { Product } from "@/models/product"
import { useCallback } from "react"

interface TotalPriceProps {
    items: Product[]
    withSelection: boolean
    tempQuantity?: { [key: string]: number }
    tip?: number
    inputTip?: boolean
}

export default function TotalPrice({ items, withSelection, tempQuantity, tip = 0, inputTip }: TotalPriceProps) {
    const sum = useCallback((): number => calculateTotalPrice(items, withSelection, tempQuantity), [items])

    const returnPrice = useCallback(() => {
        if (inputTip) return String((tip + sum()).toFixed(2))

        if (tip) return String((tip * sum() + sum()).toFixed(2))

        return String(sum())
    }, [items, tip, inputTip])

    return (
        <Card
            className={`
                bg-transparent
                w-[85%]
                border-defaultGray
                border-[1px]
                p-6
                mb-8
                bg-black bg-opacity-55`}
        >
            <CardContent className='flex text-white flex-row items-center p-2 w-full rounded-lg border-none bold justify-center h-11 whitespace-pre'>
                Обща сума:{" "}
                <span className='text-yellow'>
                    {returnPrice()}
                    лв.
                </span>
            </CardContent>
        </Card>
    )
}
