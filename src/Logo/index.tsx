import { DivProps } from '@/types';
import { useTheme } from 'antd-style';
import React from 'react';
import styled from 'styled-components';
import Divider from './Divider';
import Logo3D from './Logo3D';
import LogoFlat from './LogoFlat';
import LogoHighContrast from './LogoHighContrast';
import LogoText from './LogoText';

const View = styled.div`
  display: flex;
  align-items: center;
`;

const SubTitle = styled.div`
  white-space: nowrap;
  font-weight: 200;
`;

export interface LogoProps extends DivProps {
  type?: '3d' | 'flat' | 'high-contrast' | 'text' | 'combine';
  size?: number;
  extra?: React.ReactNode;
}

const Logo: React.FC<LogoProps> = ({ type = '3d', size = 32, style, extra, ...props }) => {
  const theme = useTheme();
  let logoComponent: React.ReactNode;
  switch (type) {
    case '3d':
      logoComponent = <Logo3D style={{ height: size, width: size, ...style }} {...props} />;
    case 'flat':
      logoComponent = <LogoFlat style={{ height: size, width: size, ...style }} {...props} />;
    case 'high-contrast':
      logoComponent = (
        <LogoHighContrast style={{ height: size, width: size, ...style }} {...props} />
      );
    case 'text':
      logoComponent = <LogoText style={{ height: size, width: 'auto', ...style }} {...props} />;
    case 'combine':
      logoComponent = (
        <View style={style} {...props}>
          <Logo3D style={{ height: size, width: size }} />
          <LogoText style={{ height: size, width: 'auto' }} />
        </View>
      );
  }

  const extraSize = Math.round((size / 3) * 2);

  return extra ? (
    <View>
      {logoComponent}
      <Divider style={{ height: extraSize, width: extraSize, color: theme.colorBorder }} />
      <SubTitle style={{ fontSize: extraSize }}>{extra}</SubTitle>
    </View>
  ) : (
    logoComponent
  );
};

export default React.memo(Logo);
