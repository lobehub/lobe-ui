import React, { type Ref, useEffect, useMemo, useRef, useState } from 'react';
import { cloneElement, isValidElement } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { isElementHidden } from './utils';

export const useTooltipReference = ({
  trigger,
  ref,
  getReferenceProps,
  setReference,
  mergedOpen,
  setOpen,
}: {
  getReferenceProps: (props: any) => any;
  mergedOpen: boolean;
  ref?: Ref<HTMLElement>;
  setOpen: (open: boolean) => void;
  setReference: (node: HTMLElement | null) => void;
  trigger: React.ReactElement | React.ReactNode;
}) => {
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);
  const previousReferenceRef = useRef<HTMLElement | null>(null);
  const previousConnectedRef = useRef(false);

  const referenceConnected = Boolean(referenceEl && !isElementHidden(referenceEl));

  const referenceNode = useMemo(() => {
    if (!isValidElement(trigger)) return trigger;

    const originalRef = (trigger as any).ref;
    const setReferenceNode = (node: unknown) => {
      const resolved = node instanceof HTMLElement ? node : null;
      setReferenceEl((prev) => (prev === resolved ? prev : resolved));
    };

    return cloneElement(
      trigger as any,
      getReferenceProps({
        ...(trigger.props as any),
        ref: mergeRefs([originalRef, setReference, setReferenceNode, ref]),
      }),
    );
  }, [getReferenceProps, ref, setReference, trigger]);

  // Watch for trigger removal outside React renders.
  useEffect(() => {
    const previousReference = previousReferenceRef.current;
    const previousConnected = previousConnectedRef.current;
    const referenceChanged = previousReference && previousReference !== referenceEl;
    const previousDisconnected = previousReference ? isElementHidden(previousReference) : false;

    if (
      mergedOpen &&
      ((referenceChanged && previousDisconnected) || (previousConnected && !referenceConnected))
    ) {
      setOpen(false);
    }

    previousReferenceRef.current = referenceEl;
    previousConnectedRef.current = referenceConnected;
  }, [mergedOpen, referenceConnected, referenceEl, setOpen]);

  return {
    referenceConnected,
    referenceEl,
    referenceNode,
  };
};
