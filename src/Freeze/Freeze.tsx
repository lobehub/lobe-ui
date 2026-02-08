// @see https://barvian.me/react-exit-animations

'use client';

import { Suspense, useLayoutEffect, useRef } from 'react';

import type { FreezeProps } from './type';

const infinitePromise = new Promise<never>(() => {});
const Suspend = () => {
  throw infinitePromise;
};

const snapshotDisplays = (root: HTMLElement) => {
  const snapshot = new Map<HTMLElement, string>([[root, root.style.display]]);

  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    snapshot.set(element, element.style.display);
  }

  return snapshot;
};

const restoreDisplayIfSuspenseHidden = (element: HTMLElement, originalDisplay: string) => {
  if (element.style.display !== 'none') return;
  if (originalDisplay === 'none') return;

  element.style.display = originalDisplay;
};

const restoreSuspenseHiddenDisplay = (snapshot: Map<HTMLElement, string>) => {
  for (const [element, originalDisplay] of snapshot) {
    restoreDisplayIfSuspenseHidden(element, originalDisplay);
  }
};

const Freeze = ({ frozen, children }: FreezeProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const hasSnapshotRef = useRef(false);
  const displaySnapshotRef = useRef<Map<HTMLElement, string>>(new Map());

  const shouldSuspend = frozen && hasSnapshotRef.current;

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (!frozen) {
      displaySnapshotRef.current = snapshotDisplays(content);
      hasSnapshotRef.current = true;
      return;
    }

    if (!hasSnapshotRef.current) {
      displaySnapshotRef.current = snapshotDisplays(content);
      hasSnapshotRef.current = true;
      return;
    }

    restoreSuspenseHiddenDisplay(displaySnapshotRef.current);
  });

  useLayoutEffect(() => {
    if (!shouldSuspend) return;

    const snapshot = displaySnapshotRef.current;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const element = mutation.target as HTMLElement;
        const originalDisplay = snapshot.get(element);
        if (originalDisplay === undefined) continue;

        restoreDisplayIfSuspenseHidden(element, originalDisplay);
      }
    });

    for (const element of snapshot.keys()) {
      observer.observe(element, { attributeFilter: ['style'], attributes: true });
    }

    restoreSuspenseHiddenDisplay(snapshot);

    return () => observer.disconnect();
  }, [shouldSuspend]);

  return (
    <Suspense fallback={null}>
      {shouldSuspend && <Suspend />}
      <div ref={contentRef} style={{ display: 'contents' }}>
        {children}
      </div>
    </Suspense>
  );
};

Freeze.displayName = 'Freeze';

export default Freeze;
