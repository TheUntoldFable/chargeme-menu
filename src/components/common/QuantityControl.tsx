"use client"

import React from "react"
import IconMinus from "../../../public/svg/icons/IconMinus"
import IconPlus from "../../../public/svg/icons/IconPlus"

interface QuantityControlProps {
    tempQuantity?: number
    quantity: number
    increment: (id: string | number, quantity: number, source: "cart" | "order") => void
    decrement: (id: string | number, quantity: number, source: "cart" | "order") => void
    id: string | number
    actionsDisabled?: boolean
    source: "cart" | "order"
}

const QuantityControl: React.FC<QuantityControlProps> = ({
    tempQuantity,
    quantity,
    increment,
    decrement,
    id,
    actionsDisabled = true,
    source,
}) => {
    const preventDefaultBehavior = (
        event: React.MouseEvent<HTMLDivElement>,
        cb?: (id: string | number, quantity: number, source: "cart" | "order") => void
    ) => {
        event.preventDefault()
        if (cb) {
            cb(id, quantity, source)
        }
    }

    return (
        <div className='flex w-1/3 items-center justify-between text-white'>
            <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                    actionsDisabled ? "cursor-pointer border-yellowNew bg-transparent" : "border-lightGray"
                }`}
                onClick={(event) => actionsDisabled && preventDefaultBehavior(event, decrement)}
            >
                <IconMinus />
            </div>
            <span className={`${!actionsDisabled ? "text-lightGray" : ""}`}>{tempQuantity ? tempQuantity : quantity}</span>
            <div
                className={`rounded-full p-1 ${actionsDisabled ? "cursor-pointer bg-yellow" : "cursor-not-allowed bg-lightGray"}`}
                onClick={(event) => actionsDisabled && preventDefaultBehavior(event, increment)}
            >
                <IconPlus color='black' />
            </div>
        </div>
    )
}

export default QuantityControl
