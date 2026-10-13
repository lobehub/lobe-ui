import { ChevronDown, ChevronUp } from 'lucide-react';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

import Button from '@/base-ui/Button';

import FieldControl from './FieldControl';
import { styles } from './style';
import type { ProTableFormInstance, ProTableLocale, ProTableSearchConfig } from './type';
import type { SearchFieldSchema } from './useSearchForm';

export interface SearchFormProps {
  config: ProTableSearchConfig;
  fields: SearchFieldSchema[];
  form: ProTableFormInstance;
  loading?: boolean;
  locale: Required<Pick<ProTableLocale, 'collapse' | 'expand' | 'reset' | 'search'>> & {
    inputPlaceholder: string;
    selectPlaceholder: string;
  };
  onReset: () => void;
  values: Record<string, any>;
}

/** Pro `QueryFilter` breakpoints: columns per row for the form width. */
const colsForWidth = (width: number) => {
  if (width <= 0) return 3;
  if (width < 576) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  return 4;
};

const useWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    setWidth(node.getBoundingClientRect().width);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
};

const SearchForm = ({
  config,
  fields,
  form,
  loading,
  locale,
  onReset,
  values,
}: SearchFormProps) => {
  const { ref, width } = useWidth();
  const [innerCollapsed, setInnerCollapsed] = useState(config.defaultCollapsed ?? true);
  const collapsed = config.collapsed ?? innerCollapsed;
  const setCollapsed = (next: boolean) => {
    setInnerCollapsed(next);
    config.onCollapse?.(next);
  };

  const cols = config.span ? Math.max(1, Math.round(24 / config.span)) : colsForWidth(width);
  const layout = config.layout ?? (cols === 1 ? 'vertical' : 'horizontal');
  const labelWidth = config.labelWidth ?? 80;

  // Collapsed: one row, the action cell takes the last slot (Pro `defaultColsNumber`).
  const visibleCount = config.defaultColsNumber ?? Math.max(1, cols - 1);
  let used = 0;
  const visibility = fields.map(({ column }) => {
    const size = Math.min(column.colSize ?? 1, cols);
    used += size;
    return !collapsed || used <= visibleCount;
  });
  const collapsible =
    fields.reduce((sum, { column }) => sum + Math.min(column.colSize ?? 1, cols), 0) > visibleCount;

  const submit = () => form.submit();

  const resetDom = (
    <Button key="reset" onClick={onReset}>
      {config.resetText ?? locale.reset}
    </Button>
  );
  const submitDom = (
    <Button key="submit" loading={loading} type="primary" onClick={submit}>
      {config.searchText ?? config.submitText ?? locale.search}
    </Button>
  );
  const buttons: ReactNode[] =
    config.optionRender === false
      ? []
      : config.optionRender
        ? config.optionRender({ form, onReset, onSubmit: submit }, [resetDom, submitDom])
        : [resetDom, submitDom];

  let collapseDom: ReactNode = null;
  if (collapsible && config.collapseRender !== false) {
    collapseDom = (
      <Button
        icon={collapsed ? ChevronDown : ChevronUp}
        iconPosition="end"
        key="collapse"
        type="link"
        onClick={() => setCollapsed(!collapsed)}
      >
        {config.collapseRender
          ? config.collapseRender(collapsed)
          : collapsed
            ? locale.expand
            : locale.collapse}
      </Button>
    );
  }

  const labelStyle: CSSProperties | undefined =
    layout === 'vertical' || labelWidth === 'auto' ? undefined : { width: labelWidth };

  return (
    <form
      className={styles.search}
      data-pro-table-search=""
      ref={ref as any}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      {fields.map(({ column, name }, index) => {
        if (!visibility[index]) return null;
        const label = column.formItemProps?.label ?? column.title;
        return (
          <div
            className={styles.searchField}
            data-layout={layout}
            key={name}
            style={{
              gridColumn: `span ${Math.min(column.colSize ?? 1, cols)}`,
              ...column.formItemProps?.style,
            }}
          >
            {label !== undefined && (
              <label className={styles.searchLabel} data-layout={layout} style={labelStyle}>
                {label}
              </label>
            )}
            <div className={styles.searchFieldControl}>
              <FieldControl
                column={column}
                form={form}
                placeholder={{ input: locale.inputPlaceholder, select: locale.selectPlaceholder }}
                value={values[name]}
                onChange={(value) => form.setFieldValue(name, value)}
              />
            </div>
          </div>
        );
      })}
      {/* Enter in a text field submits the form. */}
      <button hidden type="submit" />
      {(buttons.length > 0 || collapseDom) && (
        <div className={styles.searchActions}>
          {buttons}
          {collapseDom}
        </div>
      )}
    </form>
  );
};

export default SearchForm;
