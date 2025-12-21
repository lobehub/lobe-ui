'use client';

import { type ElementType, type FC, type Ref, createElement, memo, use, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import type { AProps } from '@/types';

const createContainer = (as: ElementType) => memo((props: any) => createElement(as, props));

const A: FC<AProps & { ref?: Ref<HTMLAnchorElement> }> = (props) => {
  const config = use(ConfigContext);
  const render = config?.aAs || 'a';

  const AContainer = useMemo(() => createContainer(render), [render]);

  return <AContainer {...props} />;
};

A.displayName = 'A';

export default A;
