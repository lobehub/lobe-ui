import { FC } from 'react';

import { DivProps, SvgProps } from '@/types';

import { brandLoadingStyle } from './style';

export interface BrandLoadingProps {
  size?: number;
  text: FC<SvgProps & DivProps & { size?: number }>;
}

const BrandLoading: FC<BrandLoadingProps & SvgProps & DivProps> = ({ size, text, ...rest }) => {
  const RenderText = text;

  return <RenderText className={brandLoadingStyle} size={size} {...rest} />;
};

BrandLoading.displayName = 'BrandLoading';

export default BrandLoading;
