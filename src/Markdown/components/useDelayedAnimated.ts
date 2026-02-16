import { useEffect, useState } from 'react';

export const useDelayedAnimated = (animated?: boolean) => {
  const isAnimated = !!animated;
  const [delayedEnabled, setDelayedEnabled] = useState(isAnimated);

  useEffect(() => {
    if (animated === undefined) return;
    if (!isAnimated && delayedEnabled) {
      const timer = setTimeout(() => {
        setDelayedEnabled(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDelayedEnabled(isAnimated);
    }
  }, [animated, isAnimated, delayedEnabled]);

  return delayedEnabled ? animated : false;
};
