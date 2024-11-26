import { SVGProps } from "react"

const IconArrowRight = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={7}
        height={11}
        fill='transparent'
        {...props}
    >
        <path
            stroke='#ddd'
            d='m.977 1 4.5 4.5-4.5 4.5'
        />
    </svg>
)

export default IconArrowRight
