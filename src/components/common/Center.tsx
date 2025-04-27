import { PropsWithChildren } from "react"

const Center = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
    return <div className={`flex bg-transparent flex-1 h-[100%] justify-center items-center ${className}`}>{children}</div>
}

export default Center
