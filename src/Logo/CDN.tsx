import { memo } from 'react';
import { ReactSVG } from 'react-svg';

import { useCdnFn } from '@/ConfigProvider';
import Img, { ImgProps } from '@/Img';
import { DivProps, SvgProps } from '@/types';

import { LOGO_3D, LOGO_FLAT, LOGO_HIGH_CONTRAST, LOGO_TEXT } from './style';

export const Logo3dCDN = memo<Omit<ImgProps, 'alt' | 'src'> & { size?: number }>(
  ({ size, style, ...rest }) => {
    const genCdnUrl = useCdnFn();
    return (
      <Img
        alt="lobehub"
        height={size}
        src={genCdnUrl(LOGO_3D)}
        style={{ flex: 'none', lineHeight: 1, ...style }}
        width={size}
        {...rest}
      />
    );
  },
);

export const LogoFlatCDN = memo<SvgProps & DivProps & { size?: number }>(
  ({ size = '1em', style, ...rest }) => {
    const genCdnUrl = useCdnFn();
    return (
      <ReactSVG
        height={size}
        src={genCdnUrl(LOGO_FLAT)}
        style={{ flex: 'none', lineHeight: 1, ...style }}
        viewBox="0 0 320 320"
        width={size}
        wrapper="svg"
        xmlns="http://www.w3.org/2000/svg"
        {...(rest as any)}
      />
    );
  },
);
export const LogoHighContrastCDN = memo<SvgProps & DivProps & { size?: number }>(
  ({ size = '1em', style, ...rest }) => {
    const genCdnUrl = useCdnFn();
    return (
      <ReactSVG
        fill="currentColor"
        fillRule="evenodd"
        height={size}
        src={genCdnUrl(LOGO_HIGH_CONTRAST)}
        style={{ flex: 'none', lineHeight: 1, ...style }}
        viewBox="0 0 320 320"
        width={size}
        wrapper="svg"
        {...(rest as any)}
      />
    );
  },
);

export const LogoTextCDN = memo<SvgProps & DivProps & { size?: number }>(
  ({ size = '1em', style, ...rest }) => {
    const genCdnUrl = useCdnFn();
    return (
      <ReactSVG
        fill="currentColor"
        fillRule="evenodd"
        height={size}
        src={genCdnUrl(LOGO_TEXT)}
        style={{ flex: 'none', lineHeight: 1, width: 'fit-content', ...style }}
        viewBox="0 0 940 320"
        wrapper="svg"
        {...(rest as any)}
      />
    );
  },
);
