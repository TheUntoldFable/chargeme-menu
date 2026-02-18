import { Card, CardContent } from "@/components/ui/card"
import { calculateTotalPrice, calculateTotalPriceEur } from "@/lib/utils"
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
    const sumEur = (): number => calculateTotalPriceEur(items, withSelection, tempQuantity)

    const returnPrice = () => {
        if (inputTip) return String((tip + sum()).toFixed(2))
        if (tip) return String((tip * sum() + sum()).toFixed(2))
        return String(sum().toFixed(2))
    }

    return (
        <Card className={`mb-1 w-full border-none bg-transparent`}>
            <CardContent className='bold flex h-11 w-full flex-row items-center justify-center rounded-lg border-none p-2 whitespace-pre text-white'>
                Обща сума: <span className='text-yellow'>{returnPrice()} лв.</span>
                <span className='text-lightGray ml-2'>/ €{sumEur().toFixed(2)}</span>
            </CardContent>
        </Card>
    )
}
