import { a, config, useSpring } from '@react-spring/three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { Group } from 'three';

const NUM = 10;
export interface LogoProps {
  rotation?: [number, number, number];
}

const Logo = memo<LogoProps>(({ ...props }) => {
  const ref: any = useRef<Group>(null);
  const { scene } = useGLTF('https://gw.alipayobjects.com/os/kitchen/ygwdCZyaMZ/lobehub.gltf');
  // Hover state
  const [hovered, setHover] = useState(false);
  useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered]);
  // Events
  const [toggle, set] = useState(0);
  const [{ x }] = useSpring({ config: config.wobbly, x: toggle }, [toggle]);
  const onPointerOver = useCallback(() => setHover(true), []);
  const onPointerOut = useCallback(() => setHover(false), []);
  const onClick = useCallback(() => set((toggle) => Number(!toggle)), [set]);

  const rotation = x.to([0, 1], [0, Math.PI * 2]);

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
      <a.group
        onClick={onClick}
        onPointerOut={onPointerOut}
        onPointerOver={onPointerOver}
        rotation-y={rotation}
      >
        {/* eslint-disable-next-line react/no-unknown-property */}
        <primitive object={scene} {...props} />
      </a.group>
    </group>
  );
});

export default Logo;
