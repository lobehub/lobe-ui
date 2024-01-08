import Spline, { type SplineProps } from '@splinetool/react-spline';
import { CSSProperties, memo, useState } from 'react';

import Loading from '@/LogoThree/Loading';

export interface LogoThreeProps extends Partial<SplineProps> {
  className?: string;
  size?: number | string;
  style?: CSSProperties;
}

const LogoThree = memo<LogoThreeProps>(({ className, style, size, onLoad, ...rest }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={className}
      style={{ height: size, position: 'relative', width: size, ...style }}
    >
      {loading && <Loading />}
      <Spline
        onLoad={(splineApp) => {
          setLoading(false);
          onLoad?.(splineApp);
        }}
        scene={'https://gw.alipayobjects.com/os/kitchen/8LH7slSv3s/logo.splinecode'}
        {...rest}
      />
    </div>
  );
});

export default LogoThree;
