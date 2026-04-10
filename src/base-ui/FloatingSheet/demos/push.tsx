import { Button, Flexbox, Text } from '@lobehub/ui';
import { FloatingSheet, type FloatingSheetProps } from '@lobehub/ui/base-ui';
import { Tag } from 'antd';
import { cssVar } from 'antd-style';
import { MessageSquareMore, PanelBottomOpen, SendHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const shellStyle = {
  background: cssVar.colorBgContainer,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 20,
  boxShadow: cssVar.boxShadowSecondary,
  overflow: 'hidden',
};

const stageStyle = {
  background: `
    radial-gradient(circle at top right, color-mix(in srgb, ${cssVar.colorSuccess} 14%, transparent), transparent 38%),
    linear-gradient(180deg, ${cssVar.colorBgElevated} 0%, ${cssVar.colorBgLayout} 100%)
  `,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 18,
  display: 'flex',
  flexDirection: 'column' as const,
  height: 470,
  overflow: 'hidden',
};

const messageCardStyle = {
  background: `color-mix(in srgb, ${cssVar.colorBgContainer} 90%, transparent)`,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 14,
  padding: '12px 14px',
};

export default () => {
  const [open, setOpen] = useState(true);
  const sheetProps: FloatingSheetProps = {
    activeSnapPoint: undefined,
    className: 'floating-sheet-demo-push',
    closeThreshold: 0.25,
    defaultOpen: true,
    dismissible: false,
    headerActions: (
      <Button
        data-no-drag=""
        icon={<X size={14} />}
        size="small"
        type="text"
        onClick={() => setOpen(false)}
      />
    ),
    maxHeight: 0.72,
    minHeight: 120,
    mode: 'push',
    onOpenChange: setOpen,
    onSnapPointChange: undefined,
    open,
    snapPoints: [0.26, 0.52],
    title: <Text style={{ fontSize: 13, fontWeight: 600 }}>Draft Composer</Text>,
    variant: 'elevated',
    width: '100%',
  };

  return (
    <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 680 }}>
      <Flexbox gap={16} style={shellStyle}>
        <Flexbox gap={6} padding={20}>
          <Text style={{ color: cssVar.colorTextDescription, fontSize: 12, letterSpacing: 1.2 }}>
            PUSH MODE
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 700 }}>Conversation Composer</Text>
          <Text style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>
            The sheet consumes layout space instead of overlaying it. This presentation is useful
            when the surrounding content must remain visible and proportionally resized.
          </Text>
        </Flexbox>

        <div style={{ padding: '0 20px 20px' }}>
          <div style={stageStyle}>
            <Flexbox horizontal align="center" gap={10} justify="space-between" padding={18}>
              <Flexbox horizontal align="center" gap={10}>
                <div
                  style={{
                    alignItems: 'center',
                    background: `color-mix(in srgb, ${cssVar.colorSuccess} 14%, transparent)`,
                    borderRadius: 12,
                    color: cssVar.colorSuccess,
                    display: 'flex',
                    height: 36,
                    justifyContent: 'center',
                    width: 36,
                  }}
                >
                  <PanelBottomOpen size={18} />
                </div>
                <Flexbox gap={2}>
                  <Text style={{ fontSize: 15, fontWeight: 600 }}>Support Thread</Text>
                  <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                    Drag the composer upward to allocate more space to drafting.
                  </Text>
                </Flexbox>
              </Flexbox>
              <Button size="small" onClick={() => setOpen((value) => !value)}>
                {open ? 'Hide Composer' : 'Show Composer'}
              </Button>
            </Flexbox>

            <Flexbox flex={1} gap={10} padding={18} style={{ minHeight: 0, overflow: 'auto' }}>
              {[
                {
                  side: 'left',
                  status: 'Incoming',
                  text: 'We need a confirmation banner after the export finishes.',
                },
                {
                  side: 'right',
                  status: 'Draft Reply',
                  text: 'Acknowledged. I will update the export flow and verify the success state.',
                },
                {
                  side: 'left',
                  status: 'Incoming',
                  text: 'Please keep the activity list visible while the composer expands.',
                },
              ].map(({ side, status, text }) => (
                <Flexbox
                  align={side === 'right' ? 'flex-end' : 'flex-start'}
                  gap={6}
                  key={`${status}-${text}`}
                >
                  <Tag
                    bordered={false}
                    color={side === 'right' ? 'green' : 'blue'}
                    style={{ margin: 0 }}
                  >
                    {status}
                  </Tag>
                  <div
                    style={{
                      ...messageCardStyle,
                      maxWidth: '88%',
                    }}
                  >
                    <Flexbox horizontal align="flex-start" gap={10}>
                      <MessageSquareMore
                        size={16}
                        style={{ color: cssVar.colorTextTertiary, flexShrink: 0, marginTop: 2 }}
                      />
                      <Text style={{ fontSize: 13 }}>{text}</Text>
                    </Flexbox>
                  </div>
                </Flexbox>
              ))}
            </Flexbox>

            <FloatingSheet {...sheetProps}>
              <Flexbox gap={12} style={{ padding: '0 16px 16px' }}>
                <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
                  {['Need review', 'High priority', 'Keep thread context'].map((item) => (
                    <Tag bordered={false} color="geekblue" key={item} style={{ margin: 0 }}>
                      {item}
                    </Tag>
                  ))}
                </Flexbox>

                <textarea
                  placeholder="Summarize the implementation update for the user..."
                  rows={5}
                  style={{
                    background: cssVar.colorFillQuaternary,
                    border: `1px solid ${cssVar.colorBorderSecondary}`,
                    borderRadius: 12,
                    color: cssVar.colorText,
                    fontFamily: 'inherit',
                    fontSize: 13,
                    lineHeight: 1.6,
                    outline: 'none',
                    padding: '12px 14px',
                    resize: 'none',
                    width: '100%',
                  }}
                />

                <Flexbox horizontal align="center" gap={10} justify="space-between">
                  <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                    In push mode, the message list contracts as the sheet grows.
                  </Text>
                  <Button icon={<SendHorizontal size={14} />} size="small" type="primary">
                    Send
                  </Button>
                </Flexbox>
              </Flexbox>
            </FloatingSheet>
          </div>
        </div>
      </Flexbox>
    </Flexbox>
  );
};
