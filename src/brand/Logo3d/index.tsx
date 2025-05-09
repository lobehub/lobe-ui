'use client';

import { ImageProps } from 'antd';
import { memo } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import Img from '@/Img';
import { ImgProps } from '@/types';

import { LOGO_3D } from '../LobeHub/style';

type Logo3dProps = Omit<ImgProps & ImageProps, 'width' | 'height' | 'src'> & {
  size?: number | string;
};

const Logo3d = memo<Logo3dProps>(({ size = '1em', style, alt = 'LobeHub', ...rest }) => {
  const genCdnUrl = useCdnFn();
  return (
    <Img alt={alt} height={size} src={genCdnUrl(LOGO_3D)} style={style} width={size} {...rest} />
  );
});

Logo3d.displayName = 'LobeHubLogo3d';

export default Logo3d;
