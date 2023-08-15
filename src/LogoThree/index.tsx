import { Canvas } from '@react-three/fiber';
import { CSSProperties, Suspense, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import LobeHubLogo from '@/Logo';

import Loading from './Loading';
import Logo from './Logo';

export interface LogoThreeProps {
  className?: string;
  size?: number;
  style?: CSSProperties;
}

const LogoThree = memo<LogoThreeProps>(({ size = 320, style, className }) => {
  return (
    <ErrorBoundary fallback={<LobeHubLogo size={size} type="3d" />}>
      <Canvas
        camera={{ fov: 16, position: [10, 1, 0] }}
        className={className}
        style={
          size ? { height: size, maxHeight: size, maxWidth: size, width: size, ...style } : style
        }
      >
        <Suspense fallback={<Loading size={size / 2 > 48 ? 48 : size / 2} />}>
          <Logo rotation={[0, 1.5, 0]} />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
});

export default LogoThree;
