import { useTheme } from 'antd-style';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DivProps } from '@/types';

import { Logo3dCDN, LogoFlatCDN, LogoHighContrastCDN, LogoTextCDN } from './CDN';
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
  /**
   * @description Use cdn or not
   */
  withCDN?: boolean;
}

const Logo = memo<LogoProps>(
  ({ type = '3d', size = 32, style, extra, className, withCDN, ...rest }) => {
    const theme = useTheme();
    const { styles } = useStyles();
    let logoComponent: ReactNode;

    const ThreeRender = withCDN ? Logo3dCDN : Logo3D;
    const FlatRender = withCDN ? LogoFlatCDN : LogoFlat;
    const HCRender = withCDN ? LogoHighContrast : LogoHighContrastCDN;
    const TextRender = withCDN ? LogoText : LogoTextCDN;

    switch (type) {
      case '3d': {
        logoComponent = <ThreeRender size={size} style={style} {...rest} />;
        break;
      }
      case 'flat': {
        logoComponent = <FlatRender size={size} style={style} {...(rest as any)} />;
        break;
      }
      case 'high-contrast': {
        logoComponent = <HCRender size={size} style={style} {...(rest as any)} />;
        break;
      }
      case 'text': {
        logoComponent = (
          <TextRender className={className} size={size} style={style} {...(rest as any)} />
        );
        break;
      }
      case 'combine': {
        logoComponent = (
          <>
            <ThreeRender size={size} />
            <TextRender size={size} style={{ marginLeft: Math.round(size / 4) }} />
          </>
        );

        if (!extra)
          logoComponent = (
            <Flexbox align={'center'} className={className} flex={'none'} horizontal style={style}>
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
        align={'center'}
        className={className}
        flex={'none'}
        horizontal
        style={style}
        {...rest}
      >
        {logoComponent}
        <Divider size={extraSize} style={{ color: theme.colorFill }} />
        <div className={styles.extraTitle} style={{ fontSize: extraSize }}>
          {extra}
        </div>
      </Flexbox>
    );
  },
);

export default Logo;
