import { SVGProps } from "react"

const IconSuccess = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width={props.width ?? 35}
        height={props.height ?? 34}
        fill='none'
        {...props}
    >
        <circle
            cx={17.5}
            cy={17}
            r={17}
            fill='#3AB354'
        />
        <path
            stroke='#24252A'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={3.497}
            d='m10.513 17.636 4.72 4.748L24.5 13.06'
        />
    </svg>
)
export default IconSuccess
