import { SVGProps } from "react"

const IconBack = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={props.width ?? 8}
        height={props.height ?? 14}
        fill='none'
        {...props}
    >
        <path
            stroke={props.color ?? "#D9D9D9"}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={props.stroke ?? 2}
            d='M7 13 1 7l6-6'
        />
    </svg>
)
export default IconBack
