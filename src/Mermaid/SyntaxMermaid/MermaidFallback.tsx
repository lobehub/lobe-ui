'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import Text from '@/Text';

import { type SyntaxMermaidProps } from '../type';

interface MermaidFallbackProps {
  children: string;
  className?: string;
  message: string;
  style?: SyntaxMermaidProps['style'];
}

const MermaidFallback = memo<MermaidFallbackProps>(({ children, className, message, style }) => (
  <div className={className} style={style}>
    <Flexbox gap={8} padding={16}>
      <Text fontSize={12} type={'secondary'}>
        {message}
      </Text>
      <Text
        code
        as={'pre'}
        fontSize={12}
        style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        {children}
      </Text>
    </Flexbox>
  </div>
));

MermaidFallback.displayName = 'MermaidFallback';

export default MermaidFallback;
