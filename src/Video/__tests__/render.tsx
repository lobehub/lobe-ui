import { act, render, type RenderResult } from '@testing-library/react';
import type { ReactElement, RefObject } from 'react';

import type { VideoPlayer } from '../type';
import { type MockVideo, mockVideoElement } from './mockVideo';

export const renderVideo = (
  ui: ReactElement,
  duration = 134,
): RenderResult & { video: MockVideo } => {
  const result = render(ui);
  const element = result.container.querySelector('video');
  if (!element) throw new Error('no <video> rendered');
  const video = mockVideoElement(element);
  act(() => video.setMeta({ duration }));
  return { ...result, video };
};

export const playerRef = (): RefObject<VideoPlayer | null> => ({ current: null });
