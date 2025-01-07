'use client';

import GiscusComponent, { type GiscusProps as GiscusComponentProps } from '@giscus/react';
import { CSSProperties, memo } from 'react';

import { formatLang, useStyles } from './style';

export interface GiscusProps extends GiscusComponentProps {
  className?: string;
  style?: CSSProperties;
}

const Giscus = memo<GiscusProps>(
  ({
    style,
    className,
    reactionsEnabled = '1',
    mapping = 'title',
    lang = 'en_US',
    inputPosition = 'top',
    id = 'giscus',
    loading = 'lazy',
    emitMetadata = '0',
    ...rest
  }) => {
    const theme = useStyles();

    return (
      <div className={className} style={style}>
        <GiscusComponent
          emitMetadata={emitMetadata}
          id={id}
          inputPosition={inputPosition}
          lang={formatLang(lang)}
          loading={loading}
          mapping={mapping}
          reactionsEnabled={reactionsEnabled}
          theme={theme}
          {...rest}
        />
      </div>
    );
  },
);

export default Giscus;
