'use client';

import { useTheme } from 'antd-style';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Img from '@/Img';
import { DivProps } from '@/types';

import Divider from './components/Divider';
import LogoText from './components/LobeHubText';
import Logo3d from './components/Logo3d';
import LogoFlat from './components/LogoFlat';
import LogoMono from './components/LogoMono';
import { useStyles } from './style';

export interface LobeHubProps extends DivProps {
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
  type?: '3d' | 'flat' | 'mono' | 'text' | 'combine';
}

const LobeHub = memo<LobeHubProps>(
  ({ type = '3d', size = 32, style, extra, className, ...rest }) => {
    const theme = useTheme();
    const { styles } = useStyles();
    let logoComponent: ReactNode;

    switch (type) {
      case '3d': {
        logoComponent = <Logo3d size={size} {...rest} />;
        break;
      }
      case 'flat': {
        logoComponent = <LogoFlat size={size} style={style} />;
        break;
      }
      case 'mono': {
        logoComponent = <LogoMono size={size} style={style} />;
        break;
      }
      case 'text': {
        logoComponent = (
          <LogoText className={className} size={size} style={style} {...(rest as any)} />
        );
        break;
      }
      case 'combine': {
        logoComponent = (
          <>
            <Img
              alt="LobeHub"
              height={size}
              src={'https://hub-apac-1.lobeobjects.space/logo-3d.webp'}
              width={size}
            />
            <LogoText size={size} style={{ marginLeft: Math.round(size / 4) }} />
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

export default LobeHub;
