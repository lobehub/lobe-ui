import { useEffect, useState } from 'react';

export const useDelayedFlag = (value: boolean, delay: number | undefined) => {
  const [delayed, setDelayed] = useState(value && !delay);
  useEffect(() => {
    if (!value || !delay) {
      setDelayed(value);
      return;
    }
    const timer = setTimeout(() => setDelayed(true), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return delay ? value && delayed : value;
};
