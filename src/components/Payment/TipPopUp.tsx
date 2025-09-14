"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { calculateTotalPriceEur } from "@/lib/utils"
import { Product } from "@/models/product"
import { ChangeEvent, RefObject } from "react"
import { Button } from "../ui/button"

interface TipDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    tip: number
    setTip: (value: number) => void
    setInputTip: (value: boolean) => void
    inputRef: RefObject<HTMLInputElement>
    toggleOptions?: number[]
    basePrice: number
    orderItems: Product[]
}

const DEFAULT_OPTIONS = [0, 0.05, 0.1, 0.15, 0.2]

// Helper functions for tip calculations
const isPercentageTip = (tip: number): boolean => {
    return tip > 0 && tip <= 1
}

const calculateTipAmount = (basePrice: number, tip: number): number => {
    if (tip === 0) return 0
    return isPercentageTip(tip) ? tip * basePrice : tip
}

const calculateTotalWithTip = (basePrice: number, tip: number): number => {
    return basePrice + calculateTipAmount(basePrice, tip)
}

const calculateTipAmountEur = (baseEur: number, tip: number): number => {
    if (tip === 0) return 0
    return isPercentageTip(tip) ? tip * baseEur : tip * 0.51 // Approximate conversion for fixed amount
}

const calculateTotalWithTipEur = (baseEur: number, tip: number): number => {
    return baseEur + calculateTipAmountEur(baseEur, tip)
}

// Additional calculation functions for order processing
const calculateItemsPrice = (totalPrice: number, tip: number, inputTip: boolean): number => {
    return inputTip ? totalPrice - tip : totalPrice - tip * totalPrice
}

const calculateTipForOrder = (totalPrice: number, tip: number, inputTip: boolean): number => {
    return inputTip ? tip : tip * totalPrice
}

// Export calculation functions for use in other components
export { calculateItemsPrice, calculateTipForOrder }

export default function TipDialog({
    open,
    onOpenChange,
    onConfirm,
    tip,
    setTip,
    setInputTip,
    inputRef,
    toggleOptions = DEFAULT_OPTIONS,
    basePrice,
    orderItems,
}: TipDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className='bg-darkBg text-white'>
                <DialogHeader>
                    <DialogTitle>Добавете бакшиш</DialogTitle>
                </DialogHeader>
                <div className='mb-2 flex w-full flex-col gap-2 border-t border-lightBg p-4'>
                    <h2 className='text-base font-medium text-white'>Комплимент за сервитьора</h2>
                    <div className='flex flex-1 justify-between gap-1'>
                        {toggleOptions.map((option) => (
                            <div
                                className='mb-4 flex w-full'
                                key={option}
                            >
                                <Toggle
                                    pressed={tip === option && tip !== undefined}
                                    onClick={() => {
                                        setInputTip(false)
                                        setTip(option)
                                        if (inputRef.current?.value) {
                                            inputRef.current.value = ""
                                        }
                                    }}
                                    className='h-12 w-12 bg-lightBg text-base text-white data-[state=on]:bg-yellow data-[state=on]:text-white'
                                >
                                    {option * 100 + "%"}
                                </Toggle>
                            </div>
                        ))}
                    </div>
                    <label className='relative'>
                        <Input
                            ref={inputRef}
                            type='number'
                            className='border-2 border-lightBg text-base text-white'
                            placeholder='Въведете сума'
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                setInputTip(true)
                                if (e.target.value) {
                                    setTip(Number(e.target.value))
                                } else {
                                    setTip(0)
                                }
                            }}
                        />
                        <span className='absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-r-2xl border-2 border-lightBg bg-lighterGray text-center text-white'>
                            лв
                        </span>
                    </label>

                    {/* Total Price Display */}
                    <div className='mt-4 rounded-lg bg-lightBg p-4'>
                        <h3 className='mb-2 text-sm font-medium text-white'>Обща сума с бакшиш:</h3>
                        <div className='flex items-center justify-between'>
                            <span className='text-lg font-bold text-white'>{calculateTotalWithTip(basePrice, tip).toFixed(2)} лв</span>
                            <span className='text-sm text-lightGray'>
                                / €{calculateTotalWithTipEur(calculateTotalPriceEur(orderItems, false), tip).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className='mt-4 w-full'
                        onClick={() => {
                            onOpenChange(false)
                            onConfirm()
                        }}
                    >
                        Потвърди и продължи
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
