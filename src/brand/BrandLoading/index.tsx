import { FC } from 'react';

import { DivProps, SvgProps } from '@/types';

import './style.css';

export interface BrandLoadingProps {
  size?: number;
  text: FC<SvgProps & DivProps & { size?: number }>;
}

const BrandLoading: FC<BrandLoadingProps & SvgProps & DivProps> = ({ size, text, ...rest }) => {
  const RenderText = text;

  return <RenderText className={'lobe-brand-loading'} size={size} {...rest} />;
};

BrandLoading.displayName = 'BrandLoading';

export default BrandLoading;
