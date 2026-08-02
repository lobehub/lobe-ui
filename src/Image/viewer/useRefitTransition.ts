import type { MotionValue } from 'motion/react';
import { animate } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';

import { computeFit, type Rotation, type Size } from './geometry';
import { OPEN_SPRING } from './useFlipTransition';

export interface UseRefitTransitionOptions {
  animated: boolean;
  natural: Size;
  rotation: Rotation;
  scale: MotionValue<number>;
  viewport: Size;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export const useRefitTransition = ({
  animated,
  natural,
  rotation,
  scale,
  viewport,
  x,
  y,
}: UseRefitTransitionOptions): void => {
  const naturalRef = useRef(natural);

  useLayoutEffect(() => {
    const previousNatural = naturalRef.current;
    naturalRef.current = natural;
    if (previousNatural.width === natural.width && previousNatural.height === natural.height)
      return;
    if (!animated) return;

    const previousFit = computeFit(previousNatural, viewport, rotation);
    const nextFit = computeFit(natural, viewport, rotation);
    if (
      previousFit.width === nextFit.width &&
      previousFit.height === nextFit.height &&
      previousFit.x === nextFit.x &&
      previousFit.y === nextFit.y
    )
      return;

    const ratio = nextFit.width > 0 ? previousFit.width / nextFit.width : 1;
    if (!Number.isFinite(ratio) || ratio <= 0) return;

    const previousCenterX = previousFit.x + previousFit.width / 2;
    const previousCenterY = previousFit.y + previousFit.height / 2;
    const nextCenterX = nextFit.x + nextFit.width / 2;
    const nextCenterY = nextFit.y + nextFit.height / 2;

    const targetScale = scale.get();
    const targetX = x.get();
    const targetY = y.get();

    scale.set(targetScale * ratio);
    x.set(targetX + (previousCenterX - nextCenterX));
    y.set(targetY + (previousCenterY - nextCenterY));

    animate(scale, targetScale, OPEN_SPRING);
    animate(x, targetX, OPEN_SPRING);
    animate(y, targetY, OPEN_SPRING);
  }, [animated, natural, rotation, scale, viewport, x, y]);
};
