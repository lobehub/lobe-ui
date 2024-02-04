import { memo } from 'react';
import { ReactSVG } from 'react-svg';

import { useCdnFn } from '@/ConfigProvider';
import { SvgProps } from '@/types';

import { LOGO_HIGH_CONTRAST } from './style';

const LogoHighContrast = memo<SvgProps | any>(({ ...rest }) => {
  const genCdnUrl = useCdnFn();

  return (
    <ReactSVG
      fill="currentColor"
      fillRule="evenodd"
      src={genCdnUrl(LOGO_HIGH_CONTRAST)}
      viewBox="0 0 320 320"
      wrapper="svg"
      {...rest}
    />
  );
});

export default LogoHighContrast;
