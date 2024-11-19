"use client"

import { PropsWithChildren } from "react"

export type WrapperProps = {
    className?: string
} & PropsWithChildren

const Wrapper = ({ children, className }: WrapperProps) => {
    return (
        <div className={`bg-default mx-auto flex max-w-mobile flex-1 flex-col items-center bg-cover bg-no-repeat ${className}`}>
            {children}
        </div>
    )
}

export default Wrapper
