'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { Flexbox } from '@/Flex';
import Text from '@/Text';

import { type SyntaxMermaidProps } from '../type';
import { styles } from './style';

interface MermaidFallbackProps {
  children: string;
  className?: string;
  dataAttributes?: Record<`data-${string}`, string>;
  message: string;
  style?: SyntaxMermaidProps['style'];
}

const MermaidFallback = memo<MermaidFallbackProps>(
  ({ children, className, dataAttributes, message, style }) => (
    <div {...dataAttributes} className={className} style={style}>
      <Flexbox gap={8} padding={16}>
        <Text fontSize={12} type={'secondary'}>
          {message}
        </Text>
        <Text code as={'pre'} className={stylex.props(styles.fallbackCode).className} fontSize={12}>
          {children}
        </Text>
      </Flexbox>
    </div>
  ),
);

MermaidFallback.displayName = 'MermaidFallback';

export default MermaidFallback;
