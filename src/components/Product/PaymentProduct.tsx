"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { PaymentProductProps } from "@/models/product"
import IconMinus from "../../../public/svg/icons/IconMinus"
import IconPlus from "../../../public/svg/icons/IconPlus"

const PaymentProduct = ({
    name,
    tempQuantity,
    quantity,
    description,
    price,
    splitBill,
    checked,
    onCheckboxToggle,
}: PaymentProductProps) => {
    return (
        <div className='relative w-full'>
            <Checkbox
                onClick={onCheckboxToggle}
                className={`absolute -right-3 top-1.5 mx-2 h-6 w-6 border-[3px] ${
                    splitBill ? "border-yellowNew bg-transparent text-black" : "border-lightGray"
                }`}
                checked={checked}
                disabled={!splitBill}
            />
            <div>
                <h1 className='text-base'>{name}</h1>
                <p className='w-52 truncate text-sm text-lightGray'>{description}</p>
                <div className='flex h-10 w-full items-center justify-between gap-2 rounded-lg text-lg'>
                    <div className='flex gap-2'>
                        <p className='font-bold'>{price}лв </p>
                        <p className='text-lightGray'>x{quantity}</p>
                    </div>
                    <div className='flex w-1/3 items-center justify-between text-white'>
                        <div className='flex h-6 w-6 items-center justify-center rounded-full border border-lightGray'>
                            <IconMinus />
                        </div>
                        <span className='text-lightGray'> {tempQuantity ? tempQuantity : quantity}</span>
                        <div className='cursor-not-allow rounded-full bg-lightGray p-1'>
                            <IconPlus color='black' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentProduct
