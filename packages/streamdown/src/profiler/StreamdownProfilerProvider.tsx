'use client';

import { createContext, memo, type PropsWithChildren, use } from 'react';

import { type StreamdownProfiler } from './profiler';

const StreamdownProfilerContext = createContext<StreamdownProfiler | null>(null);

export interface StreamdownProfilerProviderProps {
  profiler?: StreamdownProfiler | null;
}

export const StreamdownProfilerProvider = memo<PropsWithChildren<StreamdownProfilerProviderProps>>(
  ({ children, profiler = null }) => {
    return <StreamdownProfilerContext value={profiler}>{children}</StreamdownProfilerContext>;
  },
);

StreamdownProfilerProvider.displayName = 'StreamdownProfilerProvider';

export const useStreamdownProfiler = () => {
  return use(StreamdownProfilerContext);
};
