import { useTheme } from 'antd-style';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useCdnFn } from '@/ConfigProvider';
import { DivProps } from '@/types';

import Divider from './Divider';
import LogoHighContrast from './LogoHighContrast';
import LogoText from './LogoText';
import { LOGO_3D, LOGO_FLAT, useStyles } from './style';

export interface LogoProps extends DivProps {
  /**
   * @description Additional React Node to be rendered next to the logo
   */
  extra?: ReactNode;
  /**
   * @description Size of the logo in pixels
   * @default 32
   */
  size?: number;
  /**
   * @description Type of the logo to be rendered
   * @default '3d'
   */
  type?: '3d' | 'flat' | 'high-contrast' | 'text' | 'combine';
}

const Logo = memo<LogoProps>(({ type = '3d', size = 32, style, extra, className, ...props }) => {
  const genCdnUrl = useCdnFn();
  const theme = useTheme();
  const { styles } = useStyles();
  let logoComponent: ReactNode;

  switch (type) {
    case '3d': {
      logoComponent = (
        <img
          alt="lobehub"
          src={genCdnUrl(LOGO_3D)}
          style={{ height: size, width: size, ...style }}
          {...props}
        />
      );
      break;
    }
    case 'flat': {
      logoComponent = (
        <img
          alt="lobehub"
          src={genCdnUrl(LOGO_FLAT)}
          style={{ height: size, width: size, ...style }}
        />
      );
      break;
    }
    case 'high-contrast': {
      logoComponent = (
        <LogoHighContrast style={{ height: size, width: size, ...style }} {...props} />
      );
      break;
    }
    case 'text': {
      logoComponent = (
        <LogoText
          className={className}
          style={{ height: size, width: 'auto', ...style }}
          {...props}
        />
      );
      break;
    }
    case 'combine': {
      logoComponent = (
        <>
          <img alt="lobehub" src={genCdnUrl(LOGO_3D)} style={{ height: size, width: size }} />
          <LogoText style={{ height: size, marginLeft: Math.round(size / 4), width: 'auto' }} />
        </>
      );
      break;
    }
  }

  if (!extra) return logoComponent;

  const extraSize = Math.round((size / 3) * 1.9);

  return (
    <Flexbox align={'center'} className={className} horizontal style={style} {...props}>
      {logoComponent}
      <Divider style={{ color: theme.colorFill, height: extraSize, width: extraSize }} />
      <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
        {extra}
      </div>
    </Flexbox>
  );
});

export default Logo;
