import * as React from 'react';
import { SVGProps } from 'react';

const IconPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width ?? 13}
    height={props.height ?? 14}
    fill="none"
    {...props}
  >
    <path
      fill={props.color ?? '#000'}
      d="M4.6 13.097 4.531 1.03l3.051-.017.07 12.068-3.052.017ZM.066 8.615.049 5.564l12.068-.07.017 3.052-12.068.069Z"
    />
  </svg>
);

export default IconPlus;
