import * as stylex from '@stylexjs/stylex';
import { ChevronRight } from 'lucide-react';

import type { SearchHit, SearchSubResult } from '../../search/types';
import { decodeEntities } from './entities';
import { Highlight } from './highlight';
import { styles } from './style';

interface SearchPreviewPaneProps {
  activeHit?: SearchHit;
  activeOptionId?: string;
  anchorIndex: number;
  onActivateAnchor: (subResult: SearchSubResult) => void;
  onHoverAnchor: (index: number) => void;
  query: string;
}

export function SearchPreviewPane({
  activeHit,
  activeOptionId,
  anchorIndex,
  query,
  onActivateAnchor,
  onHoverAnchor,
}: SearchPreviewPaneProps) {
  const anchors = activeHit?.subResults ?? [];

  return (
    <div aria-labelledby={activeOptionId} aria-live="polite" {...stylex.props(styles.preview)}>
      {activeHit ? (
        <>
          <span {...stylex.props(styles.previewCategory)}>{activeHit.category ?? 'Results'}</span>
          <h2 {...stylex.props(styles.previewTitle)}>
            <Highlight query={query} text={activeHit.title} />
          </h2>
          {activeHit.excerpt ? (
            <p {...stylex.props(styles.previewExcerpt)}>
              <Highlight query={query} text={decodeEntities(activeHit.excerpt)} />
            </p>
          ) : null}
          {anchors.length > 0 ? (
            <div {...stylex.props(styles.previewAnchors)}>
              <span {...stylex.props(styles.previewAnchorsLabel)}>On this page</span>
              {anchors.map((anchor, index) => (
                <button
                  {...stylex.props(
                    styles.previewAnchor,
                    index === anchorIndex && styles.previewAnchorActive,
                  )}
                  data-active={index === anchorIndex}
                  key={anchor.pathname}
                  tabIndex={-1}
                  type="button"
                  onClick={() => onActivateAnchor(anchor)}
                  onMouseMove={() => onHoverAnchor(index)}
                >
                  <ChevronRight
                    aria-hidden
                    {...stylex.props(styles.previewAnchorIcon)}
                    size={13}
                    strokeWidth={1.8}
                  />
                  <Highlight query={query} text={anchor.title} />
                </button>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
