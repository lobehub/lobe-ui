import { memo } from 'react';

const Divider = memo<SvgProps | any>(({ ...props }) => (
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
));

export default Divider;
