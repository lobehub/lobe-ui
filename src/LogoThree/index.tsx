import { CSSProperties, Suspense, lazy, memo, useState } from 'react';

import Loading from '@/LogoThree/Loading';

const Spline = lazy(() => import('@splinetool/react-spline'));
export interface LogoThreeProps {
  className?: string;
  size?: number | string;
  style?: CSSProperties;
}

const LogoThree = memo<LogoThreeProps>(({ className, style, size }) => {
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={className}
      style={{ height: size, position: 'relative', width: size, ...style }}
    >
      <Suspense fallback={<Loading />}>
        <>
          {loading && <Loading />}
          <Spline
            onLoad={() => setLoading(false)}
            scene={'https://gw.alipayobjects.com/os/kitchen/8LH7slSv3s/logo.splinecode'}
          />
        </>
      </Suspense>
    </div>
  );
});

export default LogoThree;
