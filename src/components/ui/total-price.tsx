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
        <Card className={`mb-1 w-full border-none bg-transparent`}>
            <CardContent className='bold flex h-11 w-full flex-row items-center justify-center whitespace-pre rounded-lg border-none p-2 text-white'>
                Обща сума:{" "}
                <span className='text-yellow'>
                    {returnPrice()}
                    лв.
                </span>
            </CardContent>
        </Card>
    )
}
