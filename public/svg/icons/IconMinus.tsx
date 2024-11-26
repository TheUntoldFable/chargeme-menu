import * as React from 'react';
import { SVGProps } from 'react';
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlSpace="preserve"
    width={props.width ?? 14}
    height={props.height ?? 15}
    viewBox="0 0 485.064 485.064"
    {...props}
  >
    <path
      fill={props.color ?? '#FFFFFF'}
      d="M458.736 181.097H26.334C11.793 181.097 0 192.884 0 207.425v70.215c0 14.541 11.787 26.328 26.334 26.328h432.402c14.541 0 26.328-11.787 26.328-26.328v-70.215c.006-14.541-11.781-26.328-26.328-26.328z"
    />
  </svg>
);
export default SvgComponent;
