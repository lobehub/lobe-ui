'use client';

import clsx from 'clsx';
import { memo, type ReactNode } from 'react';

import Divider from '@/brand/components/Divider';
import { styles } from '@/brand/LobeHub/style';
import LogoText from '@/brand/LobeHubText';
import Logo3d from '@/brand/Logo3d';
import LogoFlat from '@/brand/LogoFlat';
import LogoMono from '@/brand/LogoMono';
import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import { type DivProps } from '@/types';
import { toDataAttributes } from '@/utils/bem';

import { brandLobeHubClasses } from './stable';

export interface LobeHubProps extends DivProps {
  extra?: ReactNode;
  size?: number;
  type?: '3d' | 'flat' | 'mono' | 'text' | 'combine';
}

const LobeHub = memo<LobeHubProps>(
  ({ type = '3d', size = 32, style, extra, className, ...rest }) => {
    const rootClassName = clsx(brandLobeHubClasses(), className);
    const dataAttributes = toDataAttributes({ type });
    const logoProps = extra
      ? { className: brandLobeHubClasses('logo') }
      : { className: rootClassName, style, ...dataAttributes };
    let logoComponent: ReactNode;

    switch (type) {
      case '3d': {
        logoComponent = <Logo3d size={size} {...logoProps} {...rest} />;
        break;
      }
      case 'flat': {
        logoComponent = <LogoFlat size={size} {...logoProps} />;
        break;
      }
      case 'mono': {
        logoComponent = <LogoMono size={size} {...logoProps} />;
        break;
      }
      case 'text': {
        logoComponent = <LogoText size={size} {...logoProps} {...(rest as any)} />;
        break;
      }
      case 'combine': {
        logoComponent = (
          <>
            <Logo3d alt="LobeChat" className={brandLobeHubClasses('logo')} size={size} />
            <LogoText
              className={brandLobeHubClasses('text')}
              size={size}
              style={{ marginLeft: Math.round(size / 4) }}
            />
          </>
        );
        if (!extra)
          logoComponent = (
            <Flexbox
              horizontal
              align={'center'}
              className={rootClassName}
              flex={'none'}
              style={style}
              {...dataAttributes}
            >
              {logoComponent}
            </Flexbox>
          );
        break;
      }
    }

    if (!extra) return logoComponent;

    const extraSize = Math.round((size / 3) * 1.9);

    return (
      <Flexbox
        horizontal
        align={'center'}
        className={rootClassName}
        flex={'none'}
        style={style}
        {...dataAttributes}
        {...rest}
      >
        {logoComponent}
        <Divider size={extraSize} {...styleProps(styles.divider, brandLobeHubClasses('divider'))} />
        <div
          {...styleProps(styles.extraTitle, brandLobeHubClasses('extra'), { fontSize: extraSize })}
        >
          {extra}
        </div>
      </Flexbox>
    );
  },
);

LobeHub.displayName = 'LobeHubBrand';

export default LobeHub;
