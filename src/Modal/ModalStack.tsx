'use client';

import { memo } from 'react';

import { useIsClient } from '@/hooks/useIsClient';

import { ModalStackItem } from './ModalStackItem';
import { RawModalStackItem } from './RawModalStackItem';
import { closeModal, destroyModal, updateModal, updateRawProps } from './operations';
import type { ModalStackProps } from './stackTypes';

export const ModalStack = memo(({ stack }: ModalStackProps) => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return stack.map((item) => {
    if (item.kind === 'modal') {
      return (
        <ModalStackItem
          bridge={item.bridge}
          id={item.id}
          key={item.id}
          onClose={closeModal}
          onDestroy={destroyModal}
          onUpdate={updateModal}
          props={item.props}
        />
      );
    }

    return (
      <RawModalStackItem
        bridge={item.bridge}
        component={item.component}
        id={item.id}
        key={item.id}
        onClose={closeModal}
        onUpdate={updateRawProps}
        open={item.open}
        options={item.options}
        props={item.props}
      />
    );
  });
});

ModalStack.displayName = 'ModalStack';
