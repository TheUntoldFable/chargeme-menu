const SkeletonLine = ({ width = "w-full" }: { width?: string }) => (
    <div className={`h-4 rounded ${width} animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-darkGray via-lighterGray to-darkGray bg-[length:200%_100%]`} />
)

const SkeletonCard = ({ className }: { className?: string }) => (
    <div className={`relative mx-auto mb-2 flex w-[85%] justify-center ${className ?? "mt-8"}`}>
        {/* Category header pill */}
        <div className="absolute -top-6 z-10 rounded-xl bg-gray px-4 py-2">
            <div className="h-5 w-24 animate-[shimmer_1.8s_ease-in-out_infinite] rounded bg-gradient-to-r from-darkGray via-lighterGray to-darkGray bg-[length:200%_100%]" />
        </div>
        {/* Card body */}
        <div className="w-full rounded-lg bg-lightBg pt-8 pb-3 shadow-lg">
            <div className="flex flex-col gap-3 px-6">
                <SkeletonLine width="w-3/4" />
                <div className="border-b border-seperator" />
                <SkeletonLine width="w-1/2" />
                <div className="border-b border-seperator" />
                <SkeletonLine width="w-2/3" />
            </div>
        </div>
    </div>
)

export const Loader = () => {
    return (
        <div role="status" className="w-full">
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            <SkeletonCard className="mt-12" />
            <SkeletonCard />
            <SkeletonCard />
            <span className="sr-only">Loading...</span>
        </div>
    )
}
