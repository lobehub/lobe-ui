import { Button, Flexbox, Popover, PopoverGroup, Tag } from '@lobehub/ui';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const content = (placement: string, icon: React.ReactNode) => (
  <Flexbox gap={8} style={{ padding: '8px 12px', minWidth: 180 }}>
    <Flexbox align="center" gap={6} horizontal>
      {icon}
      <div style={{ fontSize: 13, fontWeight: 600 }}>Placement</div>
    </Flexbox>
    <Flexbox
      style={{
        background: 'var(--lobe-color-fill-tertiary)',
        borderRadius: 6,
        fontSize: 12,
        fontFamily: 'monospace',
        padding: '6px 10px',
      }}
    >
      {placement}
    </Flexbox>
  </Flexbox>
);

export default () => {
  const buttonStyle = { fontSize: 12, width: 95 };

  return (
    <PopoverGroup>
      <Flexbox
        gap={8}
        style={{
          background: 'var(--lobe-color-fill-secondary)',
          borderRadius: 16,
          padding: 48,
        }}
      >
        {/* Header */}
        <Flexbox align="center" gap={8} horizontal justify="center" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>12 Placement Options</div>
          <Tag color="blue">Interactive</Tag>
        </Flexbox>

        {/* Top row */}
        <Flexbox gap={6} horizontal justify="center" style={{ marginLeft: 103 }}>
          <Popover content={content('topLeft', <ArrowUp size={14} />)} placement="topLeft">
            <Button size="small" style={buttonStyle}>
              topLeft
            </Button>
          </Popover>
          <Popover content={content('top', <ArrowUp size={14} />)} placement="top">
            <Button size="small" style={buttonStyle}>
              top
            </Button>
          </Popover>
          <Popover content={content('topRight', <ArrowUp size={14} />)} placement="topRight">
            <Button size="small" style={buttonStyle}>
              topRight
            </Button>
          </Popover>
        </Flexbox>

        {/* Middle rows */}
        <Flexbox gap={6} horizontal justify="space-between">
          <Flexbox gap={6}>
            <Popover content={content('leftTop', <ArrowLeft size={14} />)} placement="leftTop">
              <Button size="small" style={buttonStyle}>
                leftTop
              </Button>
            </Popover>
            <Popover content={content('left', <ArrowLeft size={14} />)} placement="left">
              <Button size="small" style={buttonStyle}>
                left
              </Button>
            </Popover>
            <Popover
              content={content('leftBottom', <ArrowLeft size={14} />)}
              placement="leftBottom"
            >
              <Button size="small" style={buttonStyle}>
                leftBottom
              </Button>
            </Popover>
          </Flexbox>

          <Flexbox
            align="center"
            justify="center"
            style={{
              background: 'var(--lobe-color-fill-tertiary)',
              borderRadius: 12,
              height: 120,
              width: 120,
            }}
          >
            <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 13, textAlign: 'center' }}>
              Hover any
              <br />
              button
            </div>
          </Flexbox>

          <Flexbox gap={6}>
            <Popover content={content('rightTop', <ArrowRight size={14} />)} placement="rightTop">
              <Button size="small" style={buttonStyle}>
                rightTop
              </Button>
            </Popover>
            <Popover content={content('right', <ArrowRight size={14} />)} placement="right">
              <Button size="small" style={buttonStyle}>
                right
              </Button>
            </Popover>
            <Popover
              content={content('rightBottom', <ArrowRight size={14} />)}
              placement="rightBottom"
            >
              <Button size="small" style={buttonStyle}>
                rightBottom
              </Button>
            </Popover>
          </Flexbox>
        </Flexbox>

        {/* Bottom row */}
        <Flexbox gap={6} horizontal justify="center" style={{ marginLeft: 103 }}>
          <Popover content={content('bottomLeft', <ArrowDown size={14} />)} placement="bottomLeft">
            <Button size="small" style={buttonStyle}>
              bottomLeft
            </Button>
          </Popover>
          <Popover content={content('bottom', <ArrowDown size={14} />)} placement="bottom">
            <Button size="small" style={buttonStyle}>
              bottom
            </Button>
          </Popover>
          <Popover
            content={content('bottomRight', <ArrowDown size={14} />)}
            placement="bottomRight"
          >
            <Button size="small" style={buttonStyle}>
              bottomRight
            </Button>
          </Popover>
        </Flexbox>
      </Flexbox>
    </PopoverGroup>
  );
};
