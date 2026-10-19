'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import Img from '@/Img';
import type { ImgProps } from '@/types';

import { LOGO_3D } from '../LobeHub/style';
import { brandLogo3dClasses } from './stable';

type Logo3dProps = Omit<ImgProps, 'width' | 'height' | 'src'> & {
  size?: number | string;
};

const Logo3d: FC<Logo3dProps> = ({ size = '1em', className, style, alt = 'LobeHub', ...rest }) => {
  const genCdnUrl = useCdnFn();
  return (
    <Img
      alt={alt}
      className={clsx(brandLogo3dClasses(), className)}
      height={size}
      src={genCdnUrl(LOGO_3D)}
      style={style}
      width={size}
      {...rest}
    />
  );
};

Logo3d.displayName = 'LobeHubLogo3d';

export default Logo3d;
