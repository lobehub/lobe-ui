import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { memo, useRef } from 'react';
import type { Group } from 'three';

const NUM = 10;
export interface LogoProps {
  rotation?: [number, number, number];
}

const Logo = memo<LogoProps>(({ ...props }) => {
  const ref: any = useRef<Group>(null);
  const { scene } = useGLTF('https://gw.alipayobjects.com/os/kitchen/ygwdCZyaMZ/lobehub.gltf');
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.set(
      Math.cos(t / 4) / NUM,
      Math.sin(t / 3) / NUM / 2,
      0.15 + Math.sin(t / 2) / NUM,
    );
    ref.current.position.y = -0.2 + (0.8 + Math.cos(t / 2)) / 7;
  });
  return (
    <group ref={ref}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <primitive object={scene} {...props} />
    </group>
  );
});

export default Logo;
