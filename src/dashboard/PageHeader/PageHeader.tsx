'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';

import { Flexbox } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';

import { styles } from './style';
import type { PageHeaderProps } from './type';

const titleStyle = {
  fontSize: cssVar.fontSizeHeading3,
  lineHeight: cssVar.lineHeightHeading3,
  margin: 0,
};
const descriptionStyle = {
  color: cssVar.colorTextSecondary,
  lineHeight: 1.6,
  maxInlineSize: '68ch',
};

function PageHeader({ action, children, description, mark, title }: PageHeaderProps) {
  const extra = action ?? children;
  return (
    <div {...stylex.props(styles.root)}>
      <Flexbox align={mark ? 'flex-start' : undefined} gap={12} horizontal={Boolean(mark)}>
        {mark}
        <Flexbox gap={8}>
          <Text as="h1" style={titleStyle} weight="bold">
            {title}
          </Text>
          {description ? <Text style={descriptionStyle}>{description}</Text> : null}
        </Flexbox>
      </Flexbox>
      {extra ? (
        <div {...styleProps(styles.actions, 'lobe-page-header-actions')}>{extra}</div>
      ) : null}
    </div>
  );
}

PageHeader.displayName = 'PageHeader';

export default PageHeader;
