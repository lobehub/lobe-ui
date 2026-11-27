'use client';

import clsx from 'clsx';
import { memo, useEffect, useRef, useState } from 'react';

import Favicon from '@/Favicon';
import citationMessages from '@/i18n/resources/en/citation';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';
import { useMergeRefs } from '@/utils/mergeRefs';

import { citationClasses } from './stable';
import { styles } from './style';
import type { CitationProps } from './type';

const safeUrl = (url?: string) => {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * An inline source marker (`[1]`) that shows the source's title, snippet and link on hover or
 * click. A lobe-ui marker and card by default, the A2UI playground look with `variant="a2ui"`.
 * Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT), `standard/composites.tsx` Citation.
 */
const Citation = memo<CitationProps>(
  ({
    className,
    classNames,
    index = 1,
    label,
    ref,
    snippet,
    source: sourceProp,
    style,
    styles: customStyles,
    texts,
    title,
    url,
    variant = 'default',
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(citationMessages);
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLSpanElement>(null);
    const mergedRef = useMergeRefs([rootRef, ref]);

    useEffect(() => {
      if (!open) return;
      const onDown = (event: MouseEvent) => {
        if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDown);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDown);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    const parsed = safeUrl(url);
    const host = parsed?.hostname.replace(/^www\./, '');
    const source = sourceProp ?? host;
    const marker = label ?? String(index);
    const markerText = typeof marker === 'string' || typeof marker === 'number' ? marker : index;
    const sourceLabel = (texts?.source ?? t('citation.source')).replace(
      '{marker}',
      String(markerText),
    );

    return (
      <span
        ref={mergedRef}
        {...toDataAttributes({ open, variant })}
        {...styleProps(
          [isA2ui && a2uiStyles.base, styles.root],
          clsx(citationClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          aria-expanded={open}
          aria-label={sourceLabel}
          type="button"
          {...styleProps(
            [focusRing.info, styles.marker, isA2ui ? styles.a2uiMarker : styles.dMarker],
            clsx(citationClasses('marker'), classNames?.marker),
            customStyles?.marker,
          )}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((value) => !value);
          }}
        >
          {marker}
        </button>
        {open && (
          <span
            role="dialog"
            {...styleProps(
              [styles.card, isA2ui ? styles.a2uiCard : styles.dCard],
              clsx(citationClasses('card'), classNames?.card),
              customStyles?.card,
            )}
          >
            {source != null && source !== '' && (
              <span
                {...styleProps(
                  [styles.source, isA2ui ? styles.a2uiSource : styles.dSource],
                  citationClasses('source'),
                )}
              >
                {host && <Favicon host={host} size={16} />}
                {source}
              </span>
            )}
            {title != null && (
              <span
                {...styleProps(isA2ui ? styles.a2uiTitle : styles.dTitle, citationClasses('title'))}
              >
                {title}
              </span>
            )}
            {snippet != null && (
              <span
                {...styleProps(
                  isA2ui ? styles.a2uiSnippet : styles.dSnippet,
                  citationClasses('snippet'),
                )}
              >
                {snippet}
              </span>
            )}
            {parsed && (
              <a
                href={parsed.href}
                rel="noopener noreferrer"
                target="_blank"
                {...styleProps(
                  [styles.link, isA2ui ? styles.a2uiLink : styles.dLink],
                  citationClasses('link'),
                )}
              >
                {texts?.openSource ?? t('citation.openSource')}
              </a>
            )}
          </span>
        )}
      </span>
    );
  },
);

Citation.displayName = 'Citation';

export default Citation;
