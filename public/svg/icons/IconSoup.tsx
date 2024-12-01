import { SVGProps } from "react"
const IconSoup = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={25}
        height={24}
        fill='none'
        {...props}
    >
        <mask
            id='a'
            fill='#fff'
        >
            <path
                fillRule='evenodd'
                d='M4.981 11.072h18.361a.682.682 0 0 1 .605.296.696.696 0 0 1 .064.675l-3.836 9a1.798 1.798 0 0 1-.621.757 1.77 1.77 0 0 1-.922.314H5.605a1.941 1.941 0 0 1-.958-.315 1.965 1.965 0 0 1-.675-.755l-3.836-9c-.196-.478.09-.973.758-.973h4.22'
                clipRule='evenodd'
            />
        </mask>
        <path
            fill={props.color ?? "#E9C500"}
            d='M4.981 11.671h.134v-1.2h-.134v1.2Zm18.361-.6v1.2h.036l.036-.002-.072-1.197Zm.67.973-1.1-.482-.005.011 1.104.47Zm-3.837 9 1.1.48.004-.01-1.104-.47Zm-1.544 1.07v1.2h.03l.03-.001-.06-1.198Zm-13.025 0-.066 1.199.033.002h.033v-1.2Zm-1.633-1.07-1.104.47.016.037.018.035 1.07-.542Zm-3.836-9-1.11.456.003.007.003.007 1.104-.47Zm4.844.227h18.361v-2.4H4.982v2.4Zm18.433-.002a.518.518 0 0 1-.259-.052l1.056-2.155a1.881 1.881 0 0 0-.94-.188l.143 2.395Zm-.259-.052a.51.51 0 0 1-.196-.168l1.977-1.361a1.889 1.889 0 0 0-.725-.626l-1.056 2.155Zm-.196-.168a.503.503 0 0 1-.087-.238l2.39-.227a1.896 1.896 0 0 0-.326-.896l-1.977 1.36Zm-.087-.238a.501.501 0 0 1 .04-.25l2.198.964c.13-.296.182-.62.151-.94l-2.389.226Zm.035-.238-3.836 9 2.208.941 3.836-9-2.208-.941Zm-3.831 8.99a.597.597 0 0 1-.206.25l1.368 1.973a2.997 2.997 0 0 0 1.036-1.262l-2.198-.962Zm-.206.25a.574.574 0 0 1-.299.103l.12 2.397a2.975 2.975 0 0 0 1.547-.527l-1.368-1.972Zm-.239.102H5.606v2.4H18.63v-2.4Zm-12.959.001a.742.742 0 0 1-.366-.12L3.99 22.801c.462.304.997.48 1.55.51l.132-2.396Zm-.366-.12a.764.764 0 0 1-.262-.295l-2.141 1.085c.25.493.624.913 1.087 1.216l1.316-2.007Zm-.229-.223-3.836-9-2.208.941 3.836 9 2.208-.941Zm-3.83-8.986a.525.525 0 0 1-.078.487c-.141.2-.309.197-.274.197v-2.4c-.633 0-1.278.246-1.681.812-.4.562-.42 1.248-.187 1.817l2.22-.913Zm-.352.684h4.22v-2.4H.895v2.4Z'
            mask='url(#a)'
        />
        <path
            fill={props.color ?? "#E9C500"}
            fillRule='evenodd'
            d='M7.345 5.2c-2.49.9 2.49 2.898 1.535-1.152a6.732 6.732 0 0 0-.59-1.269H6.686c.089.297 1.347 2.124.669 2.421h-.009Zm.678-2.988c-.098-.297-.098-.585.178-.684.786-.585 0-1.8-.758-1.35-.34.204-.608.509-.768.873-.16.365-.203.77-.124 1.161h1.472ZM11.645 5.2c-2.596.9 2.49 2.898 1.526-1.152a3.835 3.835 0 0 0-.678-1.269h-1.615c.187.297 1.436 2.124.767 2.421Zm.669-2.988c-.107-.297-.107-.585.09-.684a.775.775 0 0 0 .289-1.057.763.763 0 0 0-1.048-.293 2.11 2.11 0 0 0-.733.89 2.136 2.136 0 0 0-.16 1.144h1.562ZM15.937 5.2c-2.596.9 2.49 2.898 1.526-1.152a3.973 3.973 0 0 0-.67-1.269H15.17c.187.297 1.436 2.124.767 2.421Zm.668-2.988c-.107-.297-.107-.585.09-.684a.775.775 0 0 0 .29-1.057.763.763 0 0 0-1.048-.293 2.11 2.11 0 0 0-.733.89 2.127 2.127 0 0 0-.16 1.144h1.561Z'
            clipRule='evenodd'
        />
    </svg>
)
export default IconSoup