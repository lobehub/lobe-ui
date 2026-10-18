'use client';

import clsx from 'clsx';
import { createElement, type ElementType, type FC, memo, type Ref, use, useMemo } from 'react';

import { ConfigContext } from '@/ConfigProvider';
import { type ImgProps as HtmlImgeProps } from '@/types';

import { imgClasses } from './stable';

const createContainer = (as: ElementType) => memo((props: any) => createElement(as, props));

type ImgProps = HtmlImgeProps & { ref?: Ref<HTMLImageElement>; unoptimized?: boolean };

const Img: FC<ImgProps> = ({ unoptimized, ...rest }) => {
  const config = use(ConfigContext);
  const render = config?.imgAs || 'img';

  const ImgContainer = useMemo(() => createContainer(render), [render]);

  return (
    <ImgContainer
      unoptimized={unoptimized === undefined ? config?.imgUnoptimized : unoptimized}
      {...rest}
      className={clsx(imgClasses(), rest.className)}
    />
  );
};

Img.displayName = 'Img';

export default Img;
