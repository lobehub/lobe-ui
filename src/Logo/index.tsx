import { DivProps } from '@/types';
import { useTheme } from 'antd-style';
import React from 'react';
import Divider from './Divider';
import Logo3D from './Logo3D';
import LogoFlat from './LogoFlat';
import LogoHighContrast from './LogoHighContrast';
import LogoText from './LogoText';
import { useStyles } from './style';

export interface LogoProps extends DivProps {
  /**
   * @description Type of the logo to be rendered
   * @default '3d'
   */
  type?: '3d' | 'flat' | 'high-contrast' | 'text' | 'combine';
  /**
   * @description Size of the logo in pixels
   * @default 32
   */
  size?: number;
  /**
   * @description Additional React Node to be rendered next to the logo
   */
  extra?: React.ReactNode;
}

const Logo: React.FC<LogoProps> = ({
  type = '3d',
  size = 32,
  style,
  extra,
  className,
  ...props
}) => {
  const theme = useTheme();
  const { styles, cx } = useStyles();
  let logoComponent: React.ReactNode;
  switch (type) {
    case '3d':
      return <Logo3D style={{ height: size, width: size, ...style }} {...props} />;
    case 'flat':
      return <LogoFlat style={{ height: size, width: size, ...style }} {...props} />;
    case 'high-contrast':
      return <LogoHighContrast style={{ height: size, width: size, ...style }} {...props} />;
    case 'text':
      return <LogoText style={{ height: size, width: 'auto', ...style }} {...props} />;
    case 'combine':
      logoComponent = (
        <>
          <Logo3D style={{ height: size, width: size }} />
          <LogoText style={{ marginLeft: Math.round(size / 4), height: size, width: 'auto' }} />
        </>
      );
  }

  const extraSize = Math.round((size / 3) * 2);

  return (
    <div className={cx(styles.flexCenter, className)} style={style} {...props}>
      {logoComponent}
      {extra && (
        <>
          <Divider style={{ height: extraSize, width: extraSize, color: theme.colorBorder }} />
          <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
            {extra}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Logo);
