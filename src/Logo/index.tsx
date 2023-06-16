import { useTheme } from 'antd-style';
import { type ReactNode, memo } from 'react';

import { DivProps } from '@/types';

import Divider from './Divider';
import Logo3D from './Logo3D';
import LogoFlat from './LogoFlat';
import LogoHighContrast from './LogoHighContrast';
import LogoText from './LogoText';
import { useStyles } from './style';

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
  const theme = useTheme();
  const { styles, cx } = useStyles();
  let logoComponent: ReactNode;

  switch (type) {
    case '3d': {
      return <Logo3D style={{ height: size, width: size, ...style }} {...props} />;
    }
    case 'flat': {
      return <LogoFlat style={{ height: size, width: size, ...style }} {...props} />;
    }
    case 'high-contrast': {
      return <LogoHighContrast style={{ height: size, width: size, ...style }} {...props} />;
    }
    case 'text': {
      return <LogoText style={{ height: size, width: 'auto', ...style }} {...props} />;
    }
    case 'combine': {
      logoComponent = (
        <>
          <Logo3D style={{ height: size, width: size }} />
          <LogoText style={{ height: size, marginLeft: Math.round(size / 4), width: 'auto' }} />
        </>
      );
    }
  }

  const extraSize = Math.round((size / 3) * 1.9);

  return (
    <div className={cx(styles.flexCenter, className)} style={style} {...props}>
      {logoComponent}
      {extra && (
        <>
          <Divider style={{ color: theme.colorBorder, height: extraSize, width: extraSize }} />
          <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
            {extra}
          </div>
        </>
      )}
    </div>
  );
});

export default Logo;
