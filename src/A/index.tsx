'use client';

import { type ElementType, createElement, forwardRef, useContext, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import type { AProps } from '@/types';

const createContainer = (as: ElementType) =>
  forwardRef((props: any, ref) => createElement(as, { ...props, ref }));

const A = forwardRef<any, AProps>((props, ref) => {
  const config = useContext(ConfigContext);
  const render = config?.aAs || 'a';

  const AContainer = useMemo(() => createContainer(render), [render]);

  return <AContainer ref={ref} {...props} />;
});

A.displayName = 'A';

export default A;
