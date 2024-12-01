"use client"

import { PropsWithChildren } from "react"

export type WrapperProps = {
    className?: string
} & PropsWithChildren

const Wrapper = ({ children, className }: WrapperProps) => {
    return (
        <div
            className={`
    flex
    flex-1
    flex-col
    items-center
    h-screen
    max-h-screen
    max-w-mobile
    bg-darkBg
    bg-no-repeat
    mx-auto
    ${className}`}
        >
            {children}
        </div>
    )
}

export default Wrapper
