import { DivProps } from '@/types';
import React from 'react';
import Logo3D from './Logo3D';
import LogoFlat from './LogoFlat';
import LogoHighContrast from './LogoHighContrast';
import LogoText from './LogoText';

export interface LogoProps extends DivProps {
  type?: '3d' | 'flat' | 'high-contrast' | 'text';
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ type = '3d', size = 32, style, ...props }) => {
  switch (type) {
    case '3d':
      // @ts-ignore
      return <Logo3D style={{ height: size, width: size, ...style }} {...props} />;
    case 'flat':
      // @ts-ignore
      return <LogoFlat style={{ height: size, width: size, ...style }} {...props} />;
    case 'high-contrast':
      // @ts-ignore
      return <LogoHighContrast style={{ height: size, width: size, ...style }} {...props} />;
    case 'text':
      // @ts-ignore
      return <LogoText style={{ height: size, width: 'auto', ...style }} {...props} />;
  }
};

export default React.memo(Logo);
