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
  return (
    <ImageViewer
      entries={session.entries}
      index={session.index}
      key={session.token}
      openerFocusElement={session.openerFocusElement}
      token={session.token}
    />
  );
};

export default PreviewOutlet;
