import { PropsWithChildren } from "react"

const Center = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
    return <div className={`flex h-[100%] flex-1 items-center justify-center bg-transparent ${className}`}>{children}</div>
}

export default Center
