import { ChevronDown, ChevronUp } from 'lucide-react';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

import Button from '@/base-ui/Button';
import Form from '@/base-ui/FormKit';

import FieldControl from './FieldControl';
import { styles } from './style';
import type { ProTableFormInstance, ProTableLocale, ProTableSearchConfig } from './type';
import { rulesToFieldProps, type SearchFieldSchema } from './useSearchForm';

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
  const ref = useRef<HTMLFormElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
};

/** The query form: a base-ui `Form` laid out as a collapsible grid of `Form.Field`s. */
const SearchForm = ({ config, fields, form, loading, locale, onReset }: SearchFormProps) => {
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
    used += Math.min(column.colSize ?? 1, cols);
    return !collapsed || used <= visibleCount;
  });
  const collapsible =
    fields.reduce((sum, { column }) => sum + Math.min(column.colSize ?? 1, cols), 0) > visibleCount;

  const submit = () => void form.submit();

  const resetDom = (
    <Button key="reset" onClick={onReset}>
      {config.resetText ?? locale.reset}
    </Button>
  );
  const submitDom = (
    <Button htmlType="submit" key="submit" loading={loading} type="primary">
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

  const gridStyle = {
    '--lobe-pro-table-label-width':
      layout === 'vertical' || labelWidth === 'auto' ? 'auto' : `${labelWidth}px`,
    'display': 'grid',
    'gridTemplateColumns': `repeat(${cols}, minmax(0, 1fr))`,
  } as CSSProperties;

  return (
    <Form
      className={styles.search}
      data-pro-table-search=""
      form={form}
      layout={layout}
      ref={ref}
      style={gridStyle}
      variant="borderless"
    >
      {fields.map(({ column, name }, index) => {
        if (!visibility[index]) return null;
        const label = column.formItemProps?.label ?? column.title;
        const { required, validate } = rulesToFieldProps(
          column.formItemProps?.rules,
          column.formItemProps?.required,
        );
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
            <Form.Field
              extra={column.formItemProps?.extra}
              label={label}
              layout={layout}
              name={name}
              required={required}
              validate={validate}
              render={({ value, onChange, onBlur }) => (
                <div onBlur={onBlur}>
                  <FieldControl
                    column={column}
                    form={form}
                    value={value}
                    placeholder={{
                      input: locale.inputPlaceholder,
                      select: locale.selectPlaceholder,
                    }}
                    onChange={onChange}
                  />
                </div>
              )}
            />
          </div>
        );
      })}
      {/* Enter in a text field submits even without a visible submit button. */}
      <button hidden type="submit" />
      {(buttons.length > 0 || collapseDom) && (
        <div className={styles.searchActions}>
          {buttons}
          {collapseDom}
        </div>
      )}
    </Form>
  );
};

export default SearchForm;
