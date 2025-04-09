'use client';

import type { ImageProps } from 'antd';
import { type ElementType, Ref, createElement, memo, use, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import type { ImgProps } from '@/types';

const createContainer = (as: ElementType) => memo((props: any) => createElement(as, props));

const Img = memo<ImgProps & ImageProps & { ref?: Ref<HTMLImageElement>; unoptimized?: boolean }>(
  ({ unoptimized, ...rest }) => {
    const config = use(ConfigContext);
    const render = config?.imgAs || 'img';

    const ImgContainer = useMemo(() => createContainer(render), [render]);

    return (
      <ImgContainer
        unoptimized={unoptimized === undefined ? config?.imgUnoptimized : unoptimized}
        {...rest}
      />
    );
  },
);

Img.displayName = 'Img';

export default Img;
