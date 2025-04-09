'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';
import type { AuroraBackgroundProps } from './type';

const AuroraBackground = memo<AuroraBackgroundProps>(
  ({ ref, classNames, styles: customStyles, children, ...rest }) => {
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
