import Spline from '@splinetool/react-spline';
import { CSSProperties, memo } from 'react';

export interface LogoSplineProps {
  className?: string;
  height?: number | string;
  style?: CSSProperties;
  width?: number | string;
}

const LogoSpline = memo<LogoSplineProps>(({ className, style, width, height }) => {
  return (
    <Spline
      className={className}
      scene="https://gw.alipayobjects.com/os/kitchen/bU3%26Ge2wOa/scene.splinecode"
      style={{ height: height, width: width, ...style }}
    />
  );
});

export default LogoSpline;
