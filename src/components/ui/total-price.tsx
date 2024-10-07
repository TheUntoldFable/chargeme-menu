import { Card, CardContent } from "@/components/ui/card"
import { calculateTotalPrice } from "@/lib/utils"
import { Product } from "@/models/product"

interface TotalPriceProps {
    items: Product[]
    withSelection: boolean
    tempQuantity?: { [key: string]: number }
    tip?: number
    inputTip?: boolean
}

export default function TotalPrice({ items, withSelection, tempQuantity, tip = 0, inputTip }: TotalPriceProps) {
    const sum = (): number => calculateTotalPrice(items, withSelection, tempQuantity)

    const returnPrice = () => {
        if (inputTip) return String((tip + sum()).toFixed(2))

        if (tip) return String((tip * sum() + sum()).toFixed(2))

        return String(sum())
    }

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
