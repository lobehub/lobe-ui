'use client';

import type { RefObject } from 'react';

import ImageViewer from './ImageViewer';
import { usePreviewSession } from './registry';

export interface PreviewOutletProps {
  elementRef: RefObject<HTMLImageElement | null>;
}

const PreviewOutlet = ({ elementRef }: PreviewOutletProps) => {
  const session = usePreviewSession(elementRef);
  if (!session) return null;
  return <ImageViewer entry={session.entry} key={session.token} token={session.token} />;
};

export default PreviewOutlet;
