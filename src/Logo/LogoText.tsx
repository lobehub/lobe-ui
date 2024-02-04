import { memo } from 'react';
import { ReactSVG } from 'react-svg';

import { useCdnFn } from '@/ConfigProvider';
import { SvgProps } from '@/types';

import { LOGO_TEXT } from './style';

const LogoText = memo<SvgProps | any>(({ ...rest }) => {
  const genCdnUrl = useCdnFn();

  return (
    <ReactSVG
      fill="currentColor"
      fillRule="evenodd"
      src={genCdnUrl(LOGO_TEXT)}
      viewBox="0 0 940 320"
      wrapper="svg"
      {...rest}
    />
  );
});

export default LogoText;
