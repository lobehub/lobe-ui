import Spline, { type SplineProps } from '@splinetool/react-spline';
import { useThemeMode } from 'antd-style';
import { CSSProperties, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useCdnFn } from '@/ConfigProvider';
import Img from '@/Img';
import { LOGO_3D } from '@/Logo/style';

const LIGHT = 'https://gw.alipayobjects.com/os/kitchen/J9jiHITGrs/scene.splinecode';
const DARK = 'https://gw.alipayobjects.com/os/kitchen/CzQKKvSE8a/scene.splinecode';

export interface LogoSplineProps extends Partial<SplineProps> {
  className?: string;
  height?: number;
  style?: CSSProperties;
  width?: number;
}

const LogoSpline = memo<LogoSplineProps>(
  ({ className, style, width = 640, height = 400, onLoad, ...rest }) => {
    const genCdnUrl = useCdnFn();
    const { isDarkMode } = useThemeMode();
    const [loading, setLoading] = useState(true);
    return (
      <Flexbox
        align={'center'}
        className={className}
        flex={'none'}
        justify={'center'}
        style={{ height: height, overflow: 'hidden', position: 'relative', width: width, ...style }}
      >
        {loading && (
          <Img
            alt={'logo'}
            height={height * 0.5}
            src={genCdnUrl(LOGO_3D)}
            style={{ position: 'absolute' }}
            width={height * 0.5}
          />
        )}
        <Spline
          onLoad={(splineApp) => {
            setLoading(false);
            onLoad?.(splineApp);
          }}
          scene={isDarkMode ? DARK : LIGHT}
          style={{
            flex: 'none',
            height: height,
            width: width,
          }}
          {...rest}
        />
      </Flexbox>
    );
  },
);

export default LogoSpline;
