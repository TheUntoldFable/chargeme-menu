import { SVGProps } from "react"

const IconFailed = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width={props.width ?? 35}
        height={props.height ?? 34}
        fill='none'
        {...props}
    >
        <g clipPath='url(#a)'>
            <path
                fill='#D44760'
                fillRule='evenodd'
                d='M17.5.17C8.22.17.695 7.705.695 17c0 9.295 7.524 16.83 16.805 16.83 9.281 0 16.806-7.535 16.806-16.83C34.306 7.705 26.78.17 17.5.17Zm5.664 13.322a1.53 1.53 0 0 0-1.086-2.593c-.4-.004-.786.15-1.075.43L17.5 14.835l-3.503-3.508a1.528 1.528 0 1 0-2.16 2.164L15.34 17l-3.503 3.508a1.531 1.531 0 0 0 1.075 2.63 1.526 1.526 0 0 0 1.085-.466l3.503-3.509 3.503 3.509a1.527 1.527 0 0 0 2.59-1.088 1.531 1.531 0 0 0-.43-1.076L19.662 17l3.503-3.508Z'
                clipRule='evenodd'
            />
        </g>
        <defs>
            <clipPath id='a'>
                <path
                    fill='#fff'
                    d='M.5 0h34v34H.5z'
                />
            </clipPath>
        </defs>
    </svg>
)
export default IconFailed
