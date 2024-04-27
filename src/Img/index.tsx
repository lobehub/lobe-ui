'use client';

import { ImageProps } from 'antd';
import { ElementType, createElement, forwardRef, useContext, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import { ImgProps } from '@/types';

const createContainer = (as: ElementType) =>
  forwardRef((props: any, ref) => createElement(as, { ...props, ref }));

const Img = forwardRef<any, ImgProps & ImageProps & { unoptimized?: boolean }>(
  ({ unoptimized, ...res }, ref) => {
    const config = useContext(ConfigContext);
    const render = config?.imgAs || 'img';

    const ImgContainer = useMemo(() => createContainer(render), [render]);

    return (
      <ImgContainer
        ref={ref}
        unoptimized={unoptimized === undefined ? config?.imgUnoptimized : unoptimized}
        {...res}
      />
    );
  },
);

export default Img;
