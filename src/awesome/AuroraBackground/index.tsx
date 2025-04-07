'use client';

import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

const AuroraBackground = memo<FlexboxProps>(({ children, ...rest }) => {
  const { styles } = useStyles();
  return (
    <Flexbox {...rest}>
      <Flexbox className={styles.wrapper}>
        <div className={styles.bg} />
      </Flexbox>
      <Flexbox flex={1} style={{ zIndex: 1 }} width={'100%'}>
        {children}
      </Flexbox>
    </Flexbox>
  );
});

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
