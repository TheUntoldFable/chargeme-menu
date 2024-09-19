import { Card, CardContent } from "@/components/ui/card"
import { Product } from "@/models/product"

interface TotalPriceProps {
    items: Product[]
    withSelection: boolean
    tempQuantity?: { [key: string]: number }
    tip: number
    percentage: boolean
}

export default function TotalPrice({ items, withSelection, tempQuantity, tip, percentage }: TotalPriceProps) {
    const calculateTotalPrice = () => {
        let totalPrice = 0
        if (withSelection) items = items.filter((item) => item.isSelected)
        items.forEach((item) => {
            totalPrice += (tempQuantity ? tempQuantity[item.id] : item.quantity) * item.price
        })

        return totalPrice
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
                    {percentage
                        ? (tip * Number(calculateTotalPrice()) + Number(calculateTotalPrice())).toFixed(2)
                        : (tip + Number(calculateTotalPrice())).toFixed(2)}
                    лв.
                </span>
            </CardContent>
        </Card>
    )
}
