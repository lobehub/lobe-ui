import { ChevronRight } from 'lucide-react';

import type { SearchHit, SearchSubResult } from '../../search/types';
import { Highlight } from './highlight';
import { styles } from './style';

interface SearchPreviewPaneProps {
  activeHit?: SearchHit;
  anchorIndex: number;
  hasResults: boolean;
  loading: boolean;
  onActivateAnchor: (subResult: SearchSubResult) => void;
  onHoverAnchor: (index: number) => void;
  query: string;
}

export function SearchPreviewPane({
  activeHit,
  anchorIndex,
  hasResults,
  loading,
  query,
  onActivateAnchor,
  onHoverAnchor,
}: SearchPreviewPaneProps) {
  const status = loading
    ? 'Searching…'
    : query.trim() && !hasResults
      ? 'No results found'
      : undefined;

  const anchors = activeHit?.subResults ?? [];

  return (
    <div aria-live="polite" className={styles.preview}>
      {status ? (
        <p className={styles.previewStatus}>{status}</p>
      ) : activeHit ? (
        <>
          <span className={styles.previewCategory}>{activeHit.category ?? 'Results'}</span>
          <h2 className={styles.previewTitle}>
            <Highlight query={query} text={activeHit.title} />
          </h2>
          {activeHit.excerpt ? (
            <p className={styles.previewExcerpt}>
              <Highlight query={query} text={activeHit.excerpt} />
            </p>
          ) : null}
          {anchors.length > 0 ? (
            <div className={styles.previewAnchors}>
              <span className={styles.previewAnchorsLabel}>On this page</span>
              {anchors.map((anchor, index) => (
                <button
                  className={styles.previewAnchor}
                  data-active={index === anchorIndex}
                  key={anchor.pathname}
                  tabIndex={-1}
                  type="button"
                  onClick={() => onActivateAnchor(anchor)}
                  onMouseMove={() => onHoverAnchor(index)}
                >
                  <ChevronRight aria-hidden size={13} strokeWidth={1.8} />
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
