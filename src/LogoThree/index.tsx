import Spline from '@splinetool/react-spline';
import { CSSProperties, memo } from 'react';

export interface LogoThreeProps {
  className?: string;
  size?: number | string;
  style?: CSSProperties;
}

const LogoThree = memo<LogoThreeProps>(({ className, style, size }) => {
  return (
    <Spline
      className={className}
      scene="https://gw.alipayobjects.com/os/kitchen/8LH7slSv3s/logo.splinecode"
      style={{ height: size, width: size, ...style }}
    />
  );
});

export default LogoThree;
