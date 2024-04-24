import { useThemeMode } from 'antd-style';
import { CSSProperties, memo, useState } from 'react';

import Spline, { type SplineProps } from '@/Spline';

import Loading from './Loading';

const LIGHT = 'https://gw.alipayobjects.com/os/kitchen/J9jiHITGrs/scene.splinecode';
const DARK = 'https://gw.alipayobjects.com/os/kitchen/CzQKKvSE8a/scene.splinecode';

export interface LogoSplineProps extends Partial<SplineProps> {
  className?: string;
  height?: number | string;
  style?: CSSProperties;
  width?: number | string;
}

const LogoSpline = memo<LogoSplineProps>(({ className, style, width, height, onLoad, ...rest }) => {
  const { isDarkMode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={className}
      style={{ height: height, position: 'relative', width: width, ...style }}
    >
      {loading && <Loading />}
      <Spline
        onLoad={(splineApp) => {
          setLoading(false);
          onLoad?.(splineApp);
        }}
        scene={isDarkMode ? DARK : LIGHT}
        {...rest}
      />
    </div>
  );
});

export default LogoSpline;
