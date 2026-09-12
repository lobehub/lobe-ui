import { Flexbox } from '@lobehub/ui';
import { FocusScope, Text, useFocusScopeActive, useScopeArrowNav, useScopeSwitcher } from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';

const List = ({ id, items }: { id: string; items: string[] }) => {
  useScopeArrowNav({ scopeId: id, vimKeys: true });
  const active = useFocusScopeActive(id);
  return (
    <FocusScope
      debugOutline
      id={id}
      style={{ borderRadius: 8, flex: 1, minWidth: 0, padding: 8 }}
    >
      <Text fontSize={12} style={{ paddingInline: 8 }} type="secondary">
        {id} {active ? '· active' : ''}
      </Text>
      {items.map((item) => (
        <div
          data-scope-item
          data-id={item}
          key={item}
          style={{ borderRadius: 6, cursor: 'default', outline: 'none', padding: '6px 8px' }}
          tabIndex={-1}
          onBlur={(e) => (e.currentTarget.style.background = '')}
          onFocus={(e) => (e.currentTarget.style.background = cssVar.colorFillSecondary)}
        >
          {item}
        </div>
      ))}
    </FocusScope>
  );
};

export default () => {
  useScopeSwitcher({ vimKeys: true });
  return (
    <Flexbox gap={16} padding={16}>
      <Text type="secondary">
        Click into a list, then use ↑ ↓ (j k) to move and ← → (h l) to jump between lists — no
        focus required after the first click. Esc releases the scope.
      </Text>
      <Flexbox horizontal gap={12}>
        <List id="inbox" items={['Welcome', 'Release notes', 'Weekly digest']} />
        <List id="drafts" items={['Untitled', 'Q3 plan', 'Reply to Sam']} />
        <List id="archive" items={['2025 recap', 'Old invoice']} />
      </Flexbox>
    </Flexbox>
  );
};
