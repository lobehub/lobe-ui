'use client';

import { CSSProperties, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

export interface AuroraBackgroundProps extends FlexboxProps {
  classNames?: {
    content?: string;
    wrapper?: string;
  };
  styles?: {
    content?: CSSProperties;
    wrapper?: CSSProperties;
  };
}

const AuroraBackground = forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  ({ classNames, styles: customStyles, children, ...rest }, ref) => {
    const { cx, styles } = useStyles();
    return (
      <Flexbox ref={ref} {...rest}>
        <Flexbox className={cx(styles.wrapper, classNames?.wrapper)} style={customStyles?.wrapper}>
          <div className={styles.bg} />
        </Flexbox>
        <Flexbox
          className={classNames?.content}
          flex={1}
          style={{ zIndex: 1, ...customStyles?.content }}
          width={'100%'}
        >
          {children}
        </Flexbox>
      </Flexbox>
    );
  },
);

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
