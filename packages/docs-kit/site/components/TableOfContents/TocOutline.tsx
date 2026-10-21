import { ScrollArea, type ScrollAreaViewportProps } from '@lobehub/ui';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';

import { styles } from './style';
import { TocPathList } from './TocPathList';
import type { TocViewProps } from './types';

export function TocOutline(props: TocViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { activeId } = props;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !activeId) return;

    const link = viewport.querySelector<HTMLElement>('a[aria-current]');
    if (!link) return;

    const viewportRect = viewport.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.top < viewportRect.top) {
      viewport.scrollTop += linkRect.top - viewportRect.top - 8;
    } else if (linkRect.bottom > viewportRect.bottom) {
      viewport.scrollTop += linkRect.bottom - viewportRect.bottom + 8;
    }
  }, [activeId]);

  return (
    <nav aria-label="On this page" data-toc-outline="" {...stylex.props(styles.outline)}>
      <h2 {...stylex.props(styles.heading)}>On this page</h2>
      <ScrollArea
        disableContentFit
        scrollFade
        {...stylex.props(styles.scrollArea)}
        contentProps={stylex.props(styles.scrollContent)}
        scrollbarProps={stylex.props(styles.scrollbar)}
        viewportProps={
          {
            ...stylex.props(styles.viewport),
            'data-toc-viewport': '',
            'ref': viewportRef,
          } as ScrollAreaViewportProps
        }
      >
        <TocPathList {...props} />
      </ScrollArea>
    </nav>
  );
}
