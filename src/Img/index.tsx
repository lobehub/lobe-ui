'use client';

import type { ImageProps } from 'antd';
import { type ElementType, createElement, forwardRef, useContext, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import type { ImgProps } from '@/types';

const createContainer = (as: ElementType) =>
  forwardRef((props: any, ref) => createElement(as, { ...props, ref }));

const Img = forwardRef<any, ImgProps & ImageProps & { unoptimized?: boolean }>(
  ({ unoptimized, ...rest }, ref) => {
    const config = useContext(ConfigContext);
    const render = config?.imgAs || 'img';

    const ImgContainer = useMemo(() => createContainer(render), [render]);

    return (
      <ImgContainer
        ref={ref}
        unoptimized={unoptimized === undefined ? config?.imgUnoptimized : unoptimized}
        {...rest}
      />
    );
  },
);

Img.displayName = 'Img';

export default Img;
