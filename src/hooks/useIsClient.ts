import { useEffect, useState } from 'react';

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(typeof document !== 'undefined');

  useEffect(() => {
    if (isClient) return;
    setIsClient(true);
  }, []);

  return isClient;
};
