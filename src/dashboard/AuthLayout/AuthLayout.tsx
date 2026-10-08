'use client';

import * as stylex from '@stylexjs/stylex';

import { Flexbox } from '@/Flex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';

import { styles as surfaceStyles } from '../Surface/style';
import { styles } from './style';
import type { AuthLayoutProps } from './type';

const titleStyle = {
  fontSize: cssVar.fontSizeHeading3,
  lineHeight: cssVar.lineHeightHeading3,
  margin: 0,
};
const descriptionStyle = { color: cssVar.colorTextSecondary, lineHeight: 1.6 };

function AuthLayout({
  aside,
  brand,
  children,
  className,
  description,
  style,
  title,
  tools,
  ...rest
}: AuthLayoutProps) {
  const split = Boolean(aside);
  return (
    <div {...styleProps(styles.page, className, style)} {...rest}>
      <header {...stylex.props(styles.header)}>
        {brand}
        {tools ? <div {...stylex.props(styles.tools)}>{tools}</div> : null}
      </header>
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.lift, split && styles.liftSplit, surfaceStyles.card)}>
          <div {...stylex.props(styles.frame, split && styles.split)}>
            <div {...stylex.props(styles.form, split && styles.formSplit)}>
              <Flexbox gap={8}>
                <Text as="h1" style={titleStyle} weight="bold">
                  {title}
                </Text>
                {description ? (
                  <Text style={descriptionStyle} type="secondary">
                    {description}
                  </Text>
                ) : null}
              </Flexbox>
              {children}
            </div>
            {aside ? <div {...stylex.props(styles.aside)}>{aside}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;
