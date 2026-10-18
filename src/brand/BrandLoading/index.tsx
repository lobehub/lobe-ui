import clsx from 'clsx';
import type { FC } from 'react';

import type { DivProps, SvgProps } from '@/types';

import { brandBrandLoadingClasses } from './stable';

export interface BrandLoadingProps {
  size?: number;
  text: FC<SvgProps & DivProps & { size?: number }>;
}

const BrandLoading: FC<BrandLoadingProps & SvgProps & DivProps> = ({
  className,
  size,
  text,
  ...rest
}) => {
  const RenderText = text;

  return (
    <RenderText
      className={clsx(brandBrandLoadingClasses(), 'lobe-brand-loading', className)}
      size={size}
      {...rest}
    />
  );
};

BrandLoading.displayName = 'BrandLoading';

export default BrandLoading;
