'use client';

import { ElementType, createElement, forwardRef, useContext, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import { AProps } from '@/types';

const createContainer = (as: ElementType) =>
  forwardRef((props: any, ref) => createElement(as, { ...props, ref }));

const A = forwardRef<any, AProps>((props, ref) => {
  const config = useContext(ConfigContext);
  const render = config?.aAs || 'a';

  const AContainer = useMemo(() => createContainer(render), [render]);

  return <AContainer ref={ref} {...props} />;
});

export default A;
