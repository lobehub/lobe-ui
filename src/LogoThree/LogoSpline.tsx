import { useThemeMode } from 'antd-style';
import { CSSProperties, Suspense, lazy, memo, useState } from 'react';

import Loading from './Loading';

const Spline = lazy(() => import('@splinetool/react-spline'));
const LIGHT = 'https://gw.alipayobjects.com/os/kitchen/J9jiHITGrs/scene.splinecode';
const DARK = 'https://gw.alipayobjects.com/os/kitchen/CzQKKvSE8a/scene.splinecode';

export interface LogoSplineProps {
  className?: string;
  height?: number | string;
  style?: CSSProperties;
  width?: number | string;
}

const LogoSpline = memo<LogoSplineProps>(({ className, style, width, height }) => {
  const { isDarkMode } = useThemeMode();
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={className}
      style={{ height: height, position: 'relative', width: width, ...style }}
    >
      <Suspense fallback={<Loading />}>
        <>
          {loading && <Loading />}
          <Spline onLoad={() => setLoading(false)} scene={isDarkMode ? DARK : LIGHT} />
        </>
      </Suspense>
    </div>
  );
});

export default LogoSpline;
