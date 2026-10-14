import { Flexbox } from '@lobehub/ui';
import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
  DayjsDateRangePicker as DateRangePicker,
  type DayjsDateRangePickerProps as DateRangePickerProps,
} from '@lobehub/ui/base-ui';

import { createStaticStyles } from '@/utils/styleEngine';

const styles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    border-radius: ${cssVar.borderRadiusLG};
  `,
}));

// Object form: one style per semantic part, `popup` nests the popup parts.
const stylesObject: DatePickerProps['styles'] = {
  input: { fontStyle: 'italic' },
  popup: {
    container: { borderRadius: 12, boxShadow: '0 0 0 1px #1677ff' },
    header: { background: 'rgba(22, 119, 255, 0.08)' },
    item: { fontWeight: 600 },
  },
  root: { borderColor: '#1677ff' },
};

// Function form: computed from the picker's props (`size` is the merged size).
const stylesFn: DatePickerProps['styles'] = ({ props }) =>
  props.size === 'large'
    ? {
        popup: { container: { borderRadius: 12, boxShadow: '0 0 0 1px #722ed1' } },
        root: { borderColor: '#722ed1', borderWidth: 2 },
      }
    : {};

const rangeStylesFn: DateRangePickerProps['styles'] = ({ props }) => ({
  popup: { footer: { background: 'rgba(250, 140, 22, 0.1)' } },
  root: { borderColor: props.status === 'warning' ? undefined : '#fa8c16' },
});

export default () => (
  <Flexbox gap={12} padding={16} style={{ maxWidth: 360 }}>
    <DatePicker classNames={{ root: styles.root }} placeholder="Object" styles={stylesObject} />
    <DatePicker
      classNames={{ popup: styles.root, root: styles.root }}
      placeholder="Function"
      size="large"
      styles={stylesFn}
    />
    <DateRangePicker
      showNow
      classNames={({ props }) => ({ root: props.size === 'medium' ? styles.root : undefined })}
      styles={rangeStylesFn}
    />
  </Flexbox>
);
