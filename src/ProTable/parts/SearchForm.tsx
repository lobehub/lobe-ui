import Form from '@lobehub/ui/form';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

import Button from '@/Button';

import { rulesToFieldProps, type SearchFieldSchema } from '../hooks/useSearchForm';
import { styles } from '../style';
import type {
  ProTableFormInstance,
  ProTableLocale,
  ProTableSearchConfig,
  ProTableSpanBreakpoint,
  ProTableSpanConfig,
} from '../type';
import FieldControl from './FieldControl';

export interface SearchFormProps {
  config: ProTableSearchConfig;
  fields: SearchFieldSchema[];
  form: ProTableFormInstance;
  ignoreRules?: boolean;
  layout?: 'horizontal' | 'vertical';
  loading?: boolean;
  locale: Required<Pick<ProTableLocale, 'collapse' | 'expand' | 'reset' | 'search'>> & {
    inputPlaceholder: string;
    selectPlaceholder: string;
  };
  onReset: () => void;
}

const colsForWidth = (width: number) => {
  if (width <= 0) return 3;
  if (width < 576) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  return 4;
};

const SPAN_BREAKPOINTS: [ProTableSpanBreakpoint, number][] = [
  ['xxl', 1600],
  ['xl', 1200],
  ['lg', 992],
  ['md', 768],
  ['sm', 576],
  ['xs', 0],
];

export const resolveSpan = (
  span: number | ProTableSpanConfig | undefined,
  width: number,
): number | undefined => {
  if (span === undefined || typeof span === 'number') return span || undefined;
  const reached = SPAN_BREAKPOINTS.findIndex(([, min]) => width >= min);
  const start = reached === -1 ? SPAN_BREAKPOINTS.length - 1 : reached;
  for (let i = start; i < SPAN_BREAKPOINTS.length; i++) {
    const value = span[SPAN_BREAKPOINTS[i][0]];
    if (value) return value;
  }
  for (let i = start - 1; i >= 0; i--) {
    const value = span[SPAN_BREAKPOINTS[i][0]];
    if (value) return value;
  }
  return undefined;
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

export const SearchLabel = ({ text }: { text: string }) => (
  <span
    className={styles.searchLabelText}
    onMouseEnter={(event) => {
      const el = event.currentTarget;
      const box = el.closest('label') ?? el;
      if (box.scrollWidth > box.clientWidth) el.title = text;
      else el.removeAttribute('title');
    }}
  >
    {text}
  </span>
);

const verticalColsForWidth = (width: number) => {
  if (width <= 0) return 3;
  if (width < 576) return 1;
  if (width < 768) return 2;
  if (width < 1200) return 3;
  return 4;
};

const SearchForm = ({
  config,
  fields,
  form,
  ignoreRules,
  layout: formLayout,
  loading,
  locale,
  onReset,
}: SearchFormProps) => {
  const { ref, width } = useWidth();
  const [innerCollapsed, setInnerCollapsed] = useState(config.defaultCollapsed ?? true);
  const collapsed = config.collapsed ?? innerCollapsed;
  const setCollapsed = (next: boolean) => {
    setInnerCollapsed(next);
    config.onCollapse?.(next);
  };

  const span = resolveSpan(config.span, width);
  const cols = span
    ? Math.max(1, Math.round(24 / span))
    : config.layout === 'vertical'
      ? verticalColsForWidth(width)
      : colsForWidth(width);
  const layout = config.layout ?? formLayout ?? (cols === 1 ? 'vertical' : 'horizontal');
  // Pro default: an 80px label column, long labels end in an ellipsis; 'auto' sizes to the text.
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
    'gap': '16px 24px',
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
        const { required, validate } = ignoreRules
          ? { required: undefined, validate: undefined }
          : rulesToFieldProps(column.formItemProps?.rules, column.formItemProps?.required);
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
              label={typeof label === 'string' ? <SearchLabel text={label} /> : label}
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
        <div className={styles.searchActions} data-layout={layout}>
          {buttons}
          {collapseDom}
        </div>
      )}
    </Form>
  );
};

export default SearchForm;
