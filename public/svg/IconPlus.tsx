import { SVGProps } from "react"

const CustomSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={props.width ?? 12}
        height={props.height ?? 13}
        fill='none'
        {...props}
    >
        <path
            d='M5.25 7.5H0.999824C0.447636 7.5 0 7.05236 0 6.50018C0 5.94799 0.447637 5.50035 0.999824 5.50035H5.17689H6.77723L11 5.50007C11.5523 5.50003 12 5.94774 12 6.50003C12 7.0523 11.5523 7.5 11 7.5H6.77723H5.25Z'
            fill={props.color}
        />
        <path
            d='M7 7.25L7 11.5002C7 12.0524 6.55236 12.5 6.00018 12.5C5.44799 12.5 5.00035 12.0524 5.00035 11.5002L5.00035 7.32311L5.00035 5.72277L5.00007 1.50003C5.00003 0.947742 5.44774 0.5 6.00003 0.5C6.5523 0.5 7 0.9477 7 1.49997L7 5.72277L7 7.25Z'
            fill={props.color}
        />
    </svg>
)

export default CustomSvg
