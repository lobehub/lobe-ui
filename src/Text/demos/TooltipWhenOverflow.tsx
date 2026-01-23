import { Text } from '@lobehub/ui';

export default () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>Container width: 200px (text overflows, tooltip shown)</div>
      <div style={{ width: 200 }}>
        <Text ellipsis={{ tooltip: true, tooltipWhenOverflow: true }}>
          This is a very long text that will overflow and show a tooltip when hovered.
        </Text>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>Container width: 600px (text fits, no tooltip)</div>
      <div style={{ width: 600 }}>
        <Text ellipsis={{ tooltip: true, tooltipWhenOverflow: true }}>Short text that fits.</Text>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>Multi-line ellipsis (2 rows, overflow detection)</div>
      <div style={{ width: 200 }}>
        <Text ellipsis={{ rows: 2, tooltip: true, tooltipWhenOverflow: true }}>
          This is a very long text that spans multiple lines. It will be truncated after 2 rows and
          show a tooltip only when the content actually overflows.
        </Text>
      </div>
    </div>
  </div>
);
