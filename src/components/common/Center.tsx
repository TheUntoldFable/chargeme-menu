import { PropsWithChildren } from "react"

const Center = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
    return <div className={`bg-background flex h-[100%] flex-1 items-center justify-center ${className}`}>{children}</div>
}

export default Center
