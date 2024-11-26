import { SVGProps } from "react"

const IconFood = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={props.width ?? 32}
        height={props.height ?? 30}
        fill='none'
        {...props}
    >
        <path
            stroke='#D9D9D9'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M1 22.5a15 15 0 1 1 30 0H1Zm0 5.768h30M15.999 7.5V1.73m-3.461 0h6.923'
        />
    </svg>
)
export default IconFood
