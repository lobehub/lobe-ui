import type { LucideIcon } from 'lucide-react';
import { Box, CornerDownLeft, FileText, History, PenLine, Sparkles, X } from 'lucide-react';

import type { SearchHit } from '../../search/types';
import type { DocumentManifestEntry } from '../../types/content';
import { Highlight } from './highlight';
import type { RecentEntry } from './recentStore';
import { styles } from './style';

const RESULTS_GROUP = 'Results';
const RECENT_GROUP = 'Recent';
const EXPLORE_GROUP = 'Explore';
const EMPTY_STATE_LIMIT = 5;

export interface ResultRow {
  flatIndex: number;
  group: string;
  hit: SearchHit;
  removable: boolean;
}

export interface ResultGroup {
  icon: LucideIcon;
  label: string;
  rows: ResultRow[];
}

const groupIcon = (group: string): LucideIcon => {
  switch (group) {
    case 'Components': {
      return Box;
    }
    case 'Guides': {
      return PenLine;
    }
    case RECENT_GROUP: {
      return History;
    }
    case EXPLORE_GROUP: {
      return Sparkles;
    }
    default: {
      return FileText;
    }
  }
};

const recentToHit = (entry: RecentEntry): SearchHit => ({
  category: entry.category,
  excerpt: '',
  id: `recent:${entry.pathname}`,
  pathname: entry.pathname,
  title: entry.title,
});

const documentToHit = (document: DocumentManifestEntry): SearchHit => ({
  category: document.category,
  excerpt: document.description,
  id: `explore:${document.pathname}`,
  pathname: document.pathname,
  title: document.title,
});

interface BuildGroupsInput {
  documents: readonly DocumentManifestEntry[];
  hits: SearchHit[];
  query: string;
  recents: RecentEntry[];
}

interface DraftRow {
  hit: SearchHit;
  removable: boolean;
}

interface DraftGroup {
  label: string;
  rows: DraftRow[];
}

const numberGroups = (drafts: DraftGroup[]): ResultGroup[] => {
  let flatIndex = 0;
  return drafts.map((draft) => ({
    icon: groupIcon(draft.label),
    label: draft.label,
    rows: draft.rows.map((row) => ({
      flatIndex: flatIndex++,
      group: draft.label,
      hit: row.hit,
      removable: row.removable,
    })),
  }));
};

export const buildGroups = ({
  documents,
  hits,
  query,
  recents,
}: BuildGroupsInput): ResultGroup[] => {
  if (query.trim()) {
    const order: string[] = [];
    const buckets = new Map<string, DraftRow[]>();
    for (const hit of hits) {
      const group = hit.category ?? RESULTS_GROUP;
      let rows = buckets.get(group);
      if (!rows) {
        rows = [];
        buckets.set(group, rows);
        order.push(group);
      }
      rows.push({ hit, removable: false });
    }
    return numberGroups(order.map((label) => ({ label, rows: buckets.get(label) ?? [] })));
  }

  const drafts: DraftGroup[] = [];
  if (recents.length > 0) {
    drafts.push({
      label: RECENT_GROUP,
      rows: recents
        .slice(0, EMPTY_STATE_LIMIT)
        .map((entry) => ({ hit: recentToHit(entry), removable: true })),
    });
  }
  drafts.push({
    label: EXPLORE_GROUP,
    rows: documents
      .slice(0, EMPTY_STATE_LIMIT)
      .map((document) => ({ hit: documentToHit(document), removable: false })),
  });
  return numberGroups(drafts);
};

export const flattenGroups = (groups: ResultGroup[]): ResultRow[] =>
  groups.flatMap((group) => group.rows);

const wordSplit = /\s+/;

const hasTitleMatch = (title: string, query: string): boolean => {
  const terms = query.trim().toLowerCase().split(wordSplit).filter(Boolean);
  if (terms.length === 0) return false;
  const words = title.toLowerCase().split(wordSplit).filter(Boolean);
  return terms.some((term) => words.some((word) => word.startsWith(term) || term.startsWith(word)));
};

interface SearchResultListProps {
  activeIndex: number;
  groups: ResultGroup[];
  listId: string;
  onActivate: (row: ResultRow) => void;
  onHover: (flatIndex: number) => void;
  onRemove: (pathname: string) => void;
  optionId: (flatIndex: number) => string;
  query: string;
  status: string;
}

export function SearchResultList({
  activeIndex,
  groups,
  listId,
  optionId,
  query,
  status,
  onActivate,
  onHover,
  onRemove,
}: SearchResultListProps) {
  return (
    <div className={styles.listPane}>
      <div aria-live="polite" className={styles.resultsStatus}>
        {status}
      </div>
      <div className={styles.results} id={listId} role="listbox">
        {groups.map((group) => (
          <div aria-label={group.label} className={styles.group} key={group.label} role="group">
            <div aria-hidden className={styles.groupLabel}>
              {group.label}
            </div>
            {group.rows.map((row) => {
              const RowIcon = group.icon;
              const selected = row.flatIndex === activeIndex;
              return (
                <div
                  aria-selected={selected}
                  className={styles.result}
                  id={optionId(row.flatIndex)}
                  key={row.hit.id}
                  role="option"
                  onClick={() => onActivate(row)}
                  onMouseMove={() => onHover(row.flatIndex)}
                >
                  <span className={styles.resultIcon}>
                    <RowIcon aria-hidden size={14} strokeWidth={1.8} />
                  </span>
                  <span className={styles.resultTitle}>
                    <Highlight query={query} text={row.hit.title} />
                    {row.hit.excerpt && query.trim() && !hasTitleMatch(row.hit.title, query) ? (
                      <span className={styles.resultExcerpt}>
                        {' — '}
                        <Highlight query={query} text={row.hit.excerpt} />
                      </span>
                    ) : null}
                  </span>
                  {row.removable ? (
                    <button
                      aria-label={`Remove ${row.hit.title} from recents`}
                      className={styles.resultRemove}
                      tabIndex={-1}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemove(row.hit.pathname);
                      }}
                    >
                      <X aria-hidden size={13} strokeWidth={1.8} />
                    </button>
                  ) : selected ? (
                    <CornerDownLeft
                      aria-hidden
                      className={styles.resultEnter}
                      size={13}
                      strokeWidth={1.8}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
