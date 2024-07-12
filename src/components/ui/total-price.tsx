import { Card, CardContent } from "@/components/ui/card"
import { calculateTotalPrice } from "@/lib/utils"
import { Product } from "@/models/product"

interface TotalPriceProps {
  items: Product[]
  withSelection: boolean
}

export default function TotalPrice({ items, withSelection }: TotalPriceProps) {
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
      <CardContent className='flex flex-row items-center p-2 w-full rounded-lg border-none bold justify-center h-11 whitespace-pre'>
        <p>
          Обща сума: <span className='text-yellow'>{calculateTotalPrice(items, withSelection)} лв.</span>
        </p>
      </CardContent>
    </Card>
  )
}
