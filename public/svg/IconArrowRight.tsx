import * as React from 'react';
import { SVGProps } from 'react';

const IconArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg width={7} height={11} fill={props.color} {...props}>
    <path stroke="#DDD" strokeWidth={1.2} d="m.977 1 4.5 4.5-4.5 4.5" />
  </svg>
);

export default IconArrowRight;
