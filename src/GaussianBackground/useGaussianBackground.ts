import { RefObject, useCallback, useEffect, useState } from 'react';

import GaussianBackgroundClient, { ColorLayer } from './vendor/gaussianBackground';

export const useGaussianBackground = (ref: RefObject<HTMLCanvasElement>) => {
  const [client, setClient] = useState<GaussianBackgroundClient>();
  useEffect(() => {
    if (!ref.current) return;
    setClient(new GaussianBackgroundClient(ref.current));
  }, []);

  const handleRun = useCallback(
    (
      layers: ColorLayer[],
      options?: {
        blurRadius?: number;
        fpsCap?: number;
        scale?: number;
      },
    ) => {
      if (!client) return;
      if (options) client.updateOptions(options);
      client.run(layers);
    },
    [client],
  );

  return handleRun;
};
