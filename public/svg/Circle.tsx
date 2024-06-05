import * as React from 'react';
import { SVGProps } from 'react';
const Circle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width ?? 22}
    height={props.height ?? 22}
    aria-hidden="true"
    className="iconify iconify--twemoji"
    viewBox="0 0 36 36"
    {...props}
  >
    <circle cx={18} cy={18} r={18} fill={props.color ?? '#FDCB58'} />
  </svg>
);
export default Circle;
