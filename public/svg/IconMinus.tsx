import { SVGProps } from "react"

const CustomSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width='12'
        height='3'
        viewBox='0 0 12 3'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
    >
        <path
            d='M5.25 2.5H0.999824C0.447636 2.5 0 2.05236 0 1.50018C0 0.947989 0.447637 0.500352 0.999824 0.500352H5.17689H6.77723L11 0.500067C11.5523 0.50003 12 0.947741 12 1.50003C12 2.0523 11.5523 2.5 11 2.5H6.77723H5.25Z'
            fill='#D9D9D9'
        />
    </svg>
)

export default CustomSvg
