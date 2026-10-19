'use client';

import './style.css';

import clsx from 'clsx';
import { AlertOctagon, AlertTriangle, Info, Lightbulb, MessageSquareWarning } from 'lucide-react';
import { type FC } from 'react';

import { Flexbox, type FlexboxProps } from '@/Flex';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { mdxCalloutClasses } from './stable';
import { styles } from './style';

export interface CalloutProps extends FlexboxProps {
  type?: 'tip' | 'error' | 'important' | 'info' | 'warning';
}

const typeIcons = {
  error: AlertOctagon,
  important: MessageSquareWarning,
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
};

const Callout: FC<CalloutProps> = ({ children, type = 'info', className, style, ...rest }) => {
  const resolvedType = type in typeIcons ? type : 'info';

  return (
    <Flexbox
      horizontal
      align={'flex-start'}
      gap={'0.75em'}
      paddingBlock={'calc(var(--lobe-markdown-margin-multiple) * 1em)'}
      paddingInline={'1em'}
      {...styleProps(
        [styles.container, styles[resolvedType]],
        clsx(mdxCalloutClasses(), className),
        style,
      )}
      {...toDataAttributes({ type: resolvedType })}
      {...rest}
    >
      <Icon
        {...styleProps(styles.icon, mdxCalloutClasses('icon'))}
        icon={typeIcons[resolvedType]}
        size={{ size: '1.2em' }}
      />
      <div
        {...styleProps(
          styles.content,
          clsx(
            mdxCalloutClasses('content'),
            'lobe-mdx-callout-content',
            resolvedType === 'info' && 'lobe-mdx-callout-underline',
          ),
        )}
      >
        <div {...styleProps(styles.inner, mdxCalloutClasses('inner'))}>{children}</div>
      </div>
    </Flexbox>
  );
};

Callout.displayName = 'MdxCallout';

export default Callout;
