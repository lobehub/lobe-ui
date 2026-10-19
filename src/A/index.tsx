'use client';

import clsx from 'clsx';
import { createElement, type ElementType, type FC, memo, type Ref, use, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import { type AProps } from '@/types';

import { aClasses } from './stable';

const createContainer = (as: ElementType) => memo((props: any) => createElement(as, props));

const A: FC<AProps & { ref?: Ref<HTMLAnchorElement> }> = (props) => {
  const config = use(ConfigContext);
  const render = config?.aAs || 'a';

  const AContainer = useMemo(() => createContainer(render), [render]);

  return <AContainer {...props} className={clsx(aClasses(), props.className)} />;
};

A.displayName = 'A';

export default A;
