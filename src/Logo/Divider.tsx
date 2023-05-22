import { SvgProps } from '@/types';
import React from 'react';

const Divider: React.FC<SvgProps | any> = (props) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    shapeRendering="geometricPrecision"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M16.88 3.549L7.12 20.451" />
  </svg>
);

export default React.memo(Divider);
