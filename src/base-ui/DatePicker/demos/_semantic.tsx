import { Flexbox, Icon } from '@lobehub/ui';
import {
  DatePicker,
  DateRangePicker,
  type PickerSemanticClassNames,
  Segmented,
  Text,
} from '@lobehub/ui/base-ui';
import { createStaticStyles, cx } from 'antd-style';
import dayjs from 'dayjs';
import { Smile } from 'lucide-react';
import { useState } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  active: css`
    outline: 2px dashed ${cssVar.colorError} !important;
    outline-offset: -2px;
  `,
  item: css`
    cursor: pointer;
    padding-block: 6px;
    padding-inline: 12px;
    border-radius: ${cssVar.borderRadius};
  `,
  itemActive: css`
    background: ${cssVar.colorFillSecondary};
  `,
  stage: css`
    position: relative;
    flex: 1;
    min-height: 460px;
    padding: 24px;
  `,
}));

const parts: { desc: string; key: string }[] = [
  { desc: 'Root element: the input box', key: 'root' },
  { desc: 'Prefix element', key: 'prefix' },
  { desc: 'Input element', key: 'input' },
  { desc: 'Suffix element: the calendar icon', key: 'suffix' },
  { desc: 'Popup root element', key: 'popup.root' },
  { desc: 'Panel container element', key: 'popup.container' },
  { desc: 'Panel header element', key: 'popup.header' },
  { desc: 'Panel body element', key: 'popup.body' },
  { desc: 'Panel content (table) element', key: 'popup.content' },
  { desc: 'Cell element', key: 'popup.item' },
  { desc: 'Panel footer element', key: 'popup.footer' },
];

// Puts the highlight class on the hovered semantic part.
const toClassNames = (key: string): PickerSemanticClassNames => {
  const [scope, name] = key.split('.');
  return name ? { popup: { [name]: styles.active } } : { [scope]: styles.active };
};

export default () => {
  const [type, setType] = useState<'single' | 'range'>('single');
  const [active, setActive] = useState('root');

  const shared = {
    classNames: toClassNames(active),
    defaultValue: dayjs('2026-10-14'),
    getPopupContainer: (node: HTMLElement) => node.parentElement!,
    open: true,
    prefix: <Icon icon={Smile} size={14} />,
    showNow: true,
  };

  return (
    <Flexbox horizontal width={'100%'}>
      <Flexbox className={styles.stage} gap={12}>
        <Segmented
          style={{ alignSelf: 'flex-start' }}
          value={type}
          options={[
            { label: 'DatePicker', value: 'single' },
            { label: 'DateRangePicker', value: 'range' },
          ]}
          onChange={(value) => setType(value as 'single' | 'range')}
        />
        <div style={{ position: 'relative' }}>
          {type === 'single' ? (
            <DatePicker {...shared} />
          ) : (
            <DateRangePicker
              {...shared}
              defaultValue={[dayjs('2026-10-14'), dayjs('2026-11-02')]}
            />
          )}
        </div>
      </Flexbox>
      <Flexbox gap={2} padding={12} style={{ width: 280 }}>
        {parts.map(({ desc, key }) => (
          <Flexbox
            className={cx(styles.item, active === key && styles.itemActive)}
            gap={2}
            key={key}
            onMouseEnter={() => setActive(key)}
          >
            <Text code>{key}</Text>
            <Text fontSize={12} type="secondary">
              {desc}
            </Text>
          </Flexbox>
        ))}
      </Flexbox>
    </Flexbox>
  );
};
