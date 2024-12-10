'use client';

import GiscusComponent, { type GiscusProps as GiscusComponentProps } from '@giscus/react';
import { useTheme, useThemeMode } from 'antd-style';
import { CSSProperties, memo, useMemo } from 'react';

import { formatLang, genStyles } from './style';

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
    const token = useTheme();
    const { isDarkMode } = useThemeMode();

    const giscusTheme = useMemo(
      () => btoa(genStyles(token, isDarkMode).styles),
      [isDarkMode, token],
    );

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
          theme={`data:text/css;base64,${giscusTheme}`}
          {...rest}
        />
      </div>
    );
  },
);

export default Giscus;
