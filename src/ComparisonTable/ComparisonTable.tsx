'use client';

// Adapted from CopilotKit a2ui-playground (MIT), `ComparisonTable` in `renderers/data.tsx`.
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { memo, type ReactNode, useEffect, useRef, useState } from 'react';

import comparisonTableMessages from '@/i18n/resources/en/comparisonTable';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { formatA2uiNumber } from '@/internal/a2ui/utils';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { comparisonTableClasses } from './stable';
import { styles } from './style';
import type { ComparisonTableProps, ComparisonTableValue } from './type';

type Fade = 'none' | 'left' | 'right' | 'both';

/** Which edge of a horizontally scrolled table still hides columns. */
const useScrollFade = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState<Fade>('none');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const left = el.scrollLeft > 2;
      const right = max > 2 && el.scrollLeft < max - 2;
      setFade(left && right ? 'both' : left ? 'left' : right ? 'right' : 'none');
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(el);
    if (el.firstElementChild) observer?.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, []);
  return { fade, ref };
};

const fadeStyles = {
  both: styles.fadeBoth,
  left: styles.fadeLeft,
  none: null,
  right: styles.fadeRight,
};

const ComparisonTable = memo<ComparisonTableProps>(
  ({
    className,
    classNames,
    featureLabel,
    highlight = -1,
    options,
    recommendedLabel,
    ref,
    rows,
    style,
    styles: customStyles,
    title,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(comparisonTableMessages);
    const { fade, ref: scrollRef } = useScrollFade();
    const hasTitle = title !== undefined && title !== null && title !== false;

    const renderValue = (value: ComparisonTableValue): ReactNode => {
      if (value === true)
        return (
          <span {...styleProps([styles.check, !isA2ui && styles.dCheck])}>
            <Check aria-label={t('comparisonTable.yes')} size={12} strokeWidth={3} />
          </span>
        );
      if (value === false)
        return (
          <X
            {...styleProps([styles.cross, !isA2ui && styles.dCross])}
            aria-label={t('comparisonTable.no')}
            size={14}
          />
        );
      if (value === null || value === undefined || value === '')
        return <span {...styleProps(styles.empty)}>-</span>;
      return (
        <span {...styleProps([styles.value, !isA2ui && styles.dValue])}>
          {typeof value === 'number' ? formatA2uiNumber(value) : value}
        </span>
      );
    };

    return (
      <div
        ref={ref}
        {...styleProps(
          isA2ui ? [a2uiStyles.base, a2uiStyles.card, styles.root] : [styles.root, styles.dCard],
          clsx(comparisonTableClasses(), className, classNames?.root),
          { ...customStyles?.root, ...style },
        )}
        data-variant={variant}
        {...rest}
      >
        {hasTitle && (
          <div
            {...styleProps(
              [styles.header, !isA2ui && styles.dHeader],
              clsx(comparisonTableClasses('header'), classNames?.header),
              customStyles?.header,
            )}
          >
            <h3
              {...styleProps(
                [a2uiStyles.title, !isA2ui && styles.dTitle],
                clsx(comparisonTableClasses('title'), classNames?.title),
                customStyles?.title,
              )}
            >
              {title}
            </h3>
          </div>
        )}
        <div ref={scrollRef} {...styleProps([styles.scroll, fadeStyles[fade]])}>
          <table
            {...styleProps(
              [styles.table, hasTitle && [styles.tableRuled, !isA2ui && styles.dTableRuled]],
              clsx(comparisonTableClasses('table'), classNames?.table),
              customStyles?.table,
            )}
          >
            <thead>
              <tr {...styleProps([styles.headRow, !isA2ui && styles.dLine])}>
                <th
                  {...styleProps([
                    styles.featureHead,
                    !isA2ui && [styles.dCell, styles.dFeatureHead],
                  ])}
                  scope="col"
                >
                  {featureLabel ?? t('comparisonTable.feature')}
                </th>
                {options.map((option, index) => (
                  <th
                    key={index}
                    scope="col"
                    {...styleProps(
                      [
                        styles.optionHead,
                        !isA2ui && styles.dCell,
                        index === highlight &&
                          (isA2ui ? styles.highlightHead : styles.dHighlightHead),
                      ],
                      comparisonTableClasses('option'),
                    )}
                  >
                    <div {...styleProps(styles.optionInner)}>
                      {index === highlight && (
                        <Tag
                          color={isA2ui ? 'accent' : 'purple'}
                          shape={isA2ui ? 'round' : 'normal'}
                          size="small"
                          variant={isA2ui ? 'a2ui' : 'filled'}
                        >
                          {recommendedLabel ?? t('comparisonTable.recommended')}
                        </Tag>
                      )}
                      <span
                        {...styleProps([
                          styles.optionName,
                          index === highlight && styles.optionNameActive,
                          !isA2ui && styles.dOptionName,
                        ])}
                      >
                        {option}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  {...styleProps([styles.row, !isA2ui && [styles.dLine, styles.dRowHover]])}
                >
                  <td
                    {...styleProps(
                      [styles.feature, !isA2ui && [styles.dCell, styles.dFeature]],
                      comparisonTableClasses('feature'),
                    )}
                  >
                    {row.feature}
                  </td>
                  {options.map((_, index) => (
                    <td
                      key={index}
                      {...styleProps(
                        [
                          styles.cell,
                          !isA2ui && styles.dCell,
                          index === highlight && (isA2ui ? styles.highlight : styles.dHighlight),
                        ],
                        comparisonTableClasses('cell'),
                      )}
                    >
                      {renderValue(row.values?.[index])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

ComparisonTable.displayName = 'ComparisonTable';

export default ComparisonTable;
