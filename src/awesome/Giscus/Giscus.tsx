'use client';

import GiscusComponent from '@giscus/react';
import clsx from 'clsx';
import { memo } from 'react';

import { awesomeGiscusClasses } from './stable';
import { formatLang, useStyles } from './style';
import type { GiscusProps } from './type';

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
      <div className={clsx(awesomeGiscusClasses(), className)} style={style}>
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

Giscus.displayName = 'Giscus';

export default Giscus;
