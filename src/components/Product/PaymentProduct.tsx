"use client"

import QuantityControl from "@/components/common/QuantityControl"
import { Checkbox } from "@/components/ui/checkbox"
import { PaymentProductProps } from "@/models/product"

const PaymentProduct = ({
    id,
    name,
    tempQuantity,
    quantity,
    description,
    splitBill,
    checked,
    onCheckboxToggle,
    increment,
    decrement,
}: PaymentProductProps) => {
    return (
        <div className='relative w-full'>
            <Checkbox
                onClick={onCheckboxToggle}
                className={`absolute top-1.5 -right-3 mx-2 h-6 w-6 border-[3px] ${
                    splitBill ? "border-yellowNew bg-transparent text-black" : "border-lightGray"
                }`}
                checked={checked}
                disabled={!splitBill}
            />
            <div>
                <h1 className='text-base'>{name}</h1>
                <p className='text-lightGray w-52 truncate text-sm'>{description}</p>
                <QuantityControl
                    tempQuantity={tempQuantity}
                    quantity={quantity}
                    increment={increment}
                    decrement={decrement}
                    id={id}
                    source='order'
                    actionsDisabled={splitBill}
                />
            </div>
        </div>
    )
}

export default PaymentProduct
