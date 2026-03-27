import { useEffect, useState } from 'react';

export const useDelayedAnimated = (animated?: boolean, delayMs = 1000) => {
  const [delayedAnimated, setDelayedAnimated] = useState(animated);

  // Watch for changes in animated prop
  useEffect(() => {
    if (animated === undefined) return;
    // Keep stream rendering alive long enough for the tail animation to finish.
    if (animated === false && delayedAnimated === true) {
      const timer = setTimeout(() => {
        setDelayedAnimated(false);
      }, delayMs);

      return () => clearTimeout(timer);
    } else {
      // For any other changes, update immediately
      setDelayedAnimated(animated);
    }
  }, [animated, delayedAnimated, delayMs]);

  return delayedAnimated;
};
