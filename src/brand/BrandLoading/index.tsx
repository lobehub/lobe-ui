import { FC } from 'react';

import { DivProps, SvgProps } from '@/types';

import './style.css';

export interface BrandLoadingProps {
  text: FC<SvgProps & DivProps & { size?: number }>;
}

const BrandLoading: FC<BrandLoadingProps & SvgProps & DivProps> = ({ text, ...rest }) => {
  const RenderText = text;

  return <RenderText className={'lobe-brand-loading'} {...rest} />;
};

export default BrandLoading;
