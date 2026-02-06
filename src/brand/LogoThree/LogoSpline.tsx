import { useThemeMode } from 'antd-style';
import { type CSSProperties, memo, useState } from 'react';

import Spline, { type SplineProps } from '@/awesome/Spline';

import Loading from './Loading';

const LIGHT = 'https://hub-apac-1.lobeobjects.space/light.splinecode';
const DARK = 'https://hub-apac-1.lobeobjects.space/dark.splinecode';

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
        scene={isDarkMode ? DARK : LIGHT}
        onLoad={(splineApp) => {
          setLoading(false);
          onLoad?.(splineApp);
        }}
        {...rest}
      />
    </div>
  );
});

export default LogoSpline;
