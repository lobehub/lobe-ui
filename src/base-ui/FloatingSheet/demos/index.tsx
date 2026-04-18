import { Button, Flexbox, Text } from '@lobehub/ui';
import { FloatingSheet, type FloatingSheetProps } from '@lobehub/ui/base-ui';
import { Tag } from 'antd';
import { cssVar } from 'antd-style';
import { ChevronUp, Database, FileText, GripHorizontal, Search, Sparkles, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

const cardStyle = {
  background: cssVar.colorBgContainer,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 20,
  boxShadow: cssVar.boxShadowSecondary,
  overflow: 'hidden',
};

const stageStyle = {
  background: `
    radial-gradient(circle at top left, color-mix(in srgb, ${cssVar.colorPrimary} 18%, transparent), transparent 38%),
    linear-gradient(180deg, ${cssVar.colorBgElevated} 0%, ${cssVar.colorBgLayout} 100%)
  `,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 18,
  minHeight: 420,
  overflow: 'hidden',
  position: 'relative' as const,
};

const surfaceCardStyle = {
  background: `color-mix(in srgb, ${cssVar.colorBgContainer} 92%, transparent)`,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 14,
};

const chipStyle = (active: boolean) => ({
  background: active
    ? `color-mix(in srgb, ${cssVar.colorPrimary} 14%, ${cssVar.colorBgContainer})`
    : cssVar.colorFillQuaternary,
  border: `1px solid ${active ? cssVar.colorPrimaryBorder : cssVar.colorBorderSecondary}`,
  borderRadius: 999,
  color: active ? cssVar.colorPrimary : cssVar.colorTextSecondary,
  cursor: 'pointer',
  padding: '6px 10px',
});

const rows = [
  {
    badge: 'Pinned',
    name: 'Architecture Overview',
    summary: 'Layout contracts, responsive bounds, and interaction rules.',
  },
  {
    badge: 'Fresh',
    name: 'API Reference',
    summary: 'Prop signatures, events, and migration details for consumers.',
  },
  {
    badge: 'Draft',
    name: 'Launch Notes',
    summary: 'Outstanding review items prior to the next release candidate.',
  },
];

const stats = [
  { label: 'Mode', value: 'Overlay' },
  { label: 'Dismiss', value: 'Drag down' },
  { label: 'Snaps', value: '30/55/84%' },
];

const DemoSection = ({
  description,
  label,
  title,
  children,
}: {
  children: ReactNode;
  description: string;
  label: string;
  title: string;
}) => (
  <Flexbox gap={16} style={cardStyle}>
    <Flexbox gap={6} padding={20}>
      <Text style={{ color: cssVar.colorTextDescription, fontSize: 12, letterSpacing: 1.2 }}>
        {label.toUpperCase()}
      </Text>
      <Flexbox horizontal align="center" gap={8} justify="space-between">
        <Text style={{ fontSize: 18, fontWeight: 700 }}>{title}</Text>
      </Flexbox>
      <Text style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>{description}</Text>
    </Flexbox>
    <div style={{ padding: '0 20px 20px' }}>{children}</div>
  </Flexbox>
);

const OverlayWorkspaceDemo = () => {
  const [open, setOpen] = useState(false);
  const sheetProps: FloatingSheetProps = {
    activeSnapPoint: undefined,
    className: 'floating-sheet-demo-overlay',
    closeThreshold: 0.25,
    defaultOpen: false,
    dismissible: true,
    headerActions: (
      <Button
        data-no-drag=""
        icon={<X size={14} />}
        size="small"
        type="text"
        onClick={() => setOpen(false)}
      />
    ),
    maxHeight: 0.9,
    minHeight: 120,
    mode: 'overlay',
    onOpenChange: setOpen,
    onSnapPointChange: undefined,
    open,
    snapPoints: [0.3, 0.55, 0.84],
    title: <Text style={{ fontSize: 13, fontWeight: 600 }}>Context Sources</Text>,
    variant: 'elevated',
    width: '100%',
  };

  return (
    <DemoSection
      description="A contextual workspace embedded inside the page. The sheet overlays the stage and preserves the surrounding layout."
      label="Overlay Mode"
      title="Research Workspace"
    >
      <div style={stageStyle}>
        <Flexbox gap={16} padding={18} style={{ height: '100%' }}>
          <Flexbox horizontal align="center" gap={10} justify="space-between">
            <Flexbox horizontal align="center" gap={10}>
              <div
                style={{
                  alignItems: 'center',
                  background: `color-mix(in srgb, ${cssVar.colorPrimary} 14%, transparent)`,
                  borderRadius: 12,
                  color: cssVar.colorPrimary,
                  display: 'flex',
                  height: 36,
                  justifyContent: 'center',
                  width: 36,
                }}
              >
                <Search size={18} />
              </div>
              <Flexbox gap={2}>
                <Text style={{ fontSize: 15, fontWeight: 600 }}>Semantic Search Session</Text>
                <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                  Inspect and refine supporting context without leaving the current canvas.
                </Text>
              </Flexbox>
            </Flexbox>
            <Button
              icon={<ChevronUp size={14} />}
              size="small"
              type="primary"
              onClick={() => setOpen(true)}
            >
              Open Sheet
            </Button>
          </Flexbox>

          <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
            {stats.map(({ label, value }) => (
              <div key={label} style={{ ...surfaceCardStyle, padding: '8px 12px' }}>
                <Text style={{ color: cssVar.colorTextTertiary, fontSize: 11 }}>{label}</Text>
                <Text style={{ display: 'block', fontSize: 13, fontWeight: 600, marginTop: 2 }}>
                  {value}
                </Text>
              </div>
            ))}
          </Flexbox>

          <Flexbox gap={10}>
            {rows.map(({ badge, name, summary }) => (
              <Flexbox
                horizontal
                align="center"
                gap={12}
                justify="space-between"
                key={name}
                style={{ ...surfaceCardStyle, padding: '14px 16px' }}
              >
                <Flexbox horizontal align="flex-start" gap={12} style={{ minWidth: 0 }}>
                  <div
                    style={{
                      alignItems: 'center',
                      background: cssVar.colorFillTertiary,
                      borderRadius: 10,
                      color: cssVar.colorTextSecondary,
                      display: 'flex',
                      flexShrink: 0,
                      height: 32,
                      justifyContent: 'center',
                      width: 32,
                    }}
                  >
                    <FileText size={15} />
                  </div>
                  <Flexbox gap={4} style={{ minWidth: 0 }}>
                    <Text style={{ fontSize: 14, fontWeight: 600 }}>{name}</Text>
                    <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                      {summary}
                    </Text>
                  </Flexbox>
                </Flexbox>
                <Tag bordered={false} color="blue" style={{ margin: 0 }}>
                  {badge}
                </Tag>
              </Flexbox>
            ))}
          </Flexbox>

          <Flexbox
            align="center"
            justify="center"
            style={{
              color: cssVar.colorTextTertiary,
              flex: 1,
              minHeight: 80,
              textAlign: 'center',
            }}
          >
            <GripHorizontal size={24} />
            <Text style={{ fontSize: 12, marginTop: 8 }}>
              The handle remains discoverable while the surrounding layout stays fixed.
            </Text>
          </Flexbox>
        </Flexbox>

        <FloatingSheet {...sheetProps}>
          <Flexbox gap={10} style={{ padding: '0 16px 16px' }}>
            {[
              {
                hint: 'Confidence 98%',
                title: 'Product Spec / Floating Layouts',
                type: 'Spec',
              },
              {
                hint: 'Updated 3h ago',
                title: 'Interaction Guidelines / Bottom Sheets',
                type: 'Guide',
              },
              {
                hint: '8 references',
                title: 'Support Tickets / Drawer Expectations',
                type: 'Signal',
              },
            ].map(({ hint, title, type }) => (
              <Flexbox
                horizontal
                align="center"
                gap={12}
                justify="space-between"
                key={title}
                style={{
                  background: cssVar.colorFillQuaternary,
                  borderRadius: 12,
                  padding: '12px 14px',
                }}
              >
                <Flexbox horizontal align="center" gap={10} style={{ minWidth: 0 }}>
                  <div
                    style={{
                      alignItems: 'center',
                      background: `color-mix(in srgb, ${cssVar.colorPrimary} 12%, transparent)`,
                      borderRadius: 10,
                      color: cssVar.colorPrimary,
                      display: 'flex',
                      flexShrink: 0,
                      height: 30,
                      justifyContent: 'center',
                      width: 30,
                    }}
                  >
                    <Database size={14} />
                  </div>
                  <Flexbox gap={2} style={{ minWidth: 0 }}>
                    <Text style={{ fontSize: 13, fontWeight: 600 }}>{title}</Text>
                    <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>{hint}</Text>
                  </Flexbox>
                </Flexbox>
                <Tag bordered={false} color="cyan" style={{ margin: 0 }}>
                  {type}
                </Tag>
              </Flexbox>
            ))}
          </Flexbox>
        </FloatingSheet>
      </div>
    </DemoSection>
  );
};

const ControlledSnapDemo = () => {
  const [open, setOpen] = useState(true);
  const [activeSnap, setActiveSnap] = useState(0.48);
  const snapPoints = [0.28, 0.48, 0.76];
  const sheetProps: FloatingSheetProps = {
    activeSnapPoint: activeSnap,
    className: 'floating-sheet-demo-controlled',
    closeThreshold: 0.25,
    defaultOpen: true,
    dismissible: true,
    headerActions: undefined,
    maxHeight: 0.9,
    minHeight: 120,
    mode: 'overlay',
    onOpenChange: setOpen,
    onSnapPointChange: setActiveSnap,
    open,
    snapPoints,
    title: <Text style={{ fontSize: 13, fontWeight: 600 }}>Inspector State</Text>,
    variant: 'embedded',
    width: '100%',
  };

  return (
    <DemoSection
      description="A controlled sheet can synchronize its active snap point with external controls, status readouts, and header actions."
      label="Controlled Snap Points"
      title="Inspector Panel"
    >
      <div style={stageStyle}>
        <Flexbox gap={16} padding={18} style={{ height: '100%' }}>
          <Flexbox horizontal align="center" gap={10} justify="space-between">
            <Flexbox gap={3}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>Live Layout Inspector</Text>
              <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>
                External controls drive the active snap state and keep the stage synchronized.
              </Text>
            </Flexbox>
            <Button size="small" onClick={() => setOpen((value) => !value)}>
              {open ? 'Hide Sheet' : 'Show Sheet'}
            </Button>
          </Flexbox>

          <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
            {snapPoints.map((point) => {
              const active = activeSnap === point;
              return (
                <div
                  key={point}
                  style={chipStyle(active)}
                  onClick={() => {
                    setActiveSnap(point);
                    if (!open) setOpen(true);
                  }}
                >
                  <Text style={{ color: 'inherit', fontSize: 12 }}>
                    Snap {Math.round(point * 100)}%
                  </Text>
                </div>
              );
            })}
          </Flexbox>

          <Flexbox gap={10}>
            {[
              {
                label: 'Top Bar',
                value: 'Pinned',
              },
              {
                label: 'Canvas',
                value: 'Adaptive',
              },
              {
                label: 'Inspector',
                value: `${Math.round(activeSnap * 100)}%`,
              },
              {
                label: 'Variant',
                value: 'Embedded',
              },
            ].map(({ label, value }) => (
              <Flexbox
                horizontal
                align="center"
                justify="space-between"
                key={label}
                style={{ ...surfaceCardStyle, padding: '12px 14px' }}
              >
                <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>{label}</Text>
                <Text style={{ fontSize: 13, fontWeight: 600 }}>{value}</Text>
              </Flexbox>
            ))}
          </Flexbox>

          <Flexbox
            align="center"
            justify="center"
            style={{
              background: `linear-gradient(180deg, transparent 0%, color-mix(in srgb, ${cssVar.colorPrimary} 10%, transparent) 100%)`,
              borderRadius: 16,
              flex: 1,
              minHeight: 120,
              textAlign: 'center',
            }}
          >
            <Sparkles size={22} style={{ color: cssVar.colorPrimary }} />
            <Text style={{ fontSize: 12, marginTop: 10, maxWidth: 220 }}>
              External snap controls are appropriate when the sheet mirrors a structured panel
              state.
            </Text>
          </Flexbox>
        </Flexbox>

        <FloatingSheet {...sheetProps}>
          <Flexbox gap={10} style={{ padding: '0 16px 16px' }}>
            {[
              { label: 'Component', value: 'FloatingSheet' },
              { label: 'Mode', value: 'overlay' },
              { label: 'Active snap', value: `${Math.round(activeSnap * 100)}%` },
              { label: 'Dismissible', value: 'true' },
            ].map(({ label, value }) => (
              <Flexbox
                horizontal
                align="center"
                justify="space-between"
                key={label}
                style={{
                  background: cssVar.colorFillQuaternary,
                  borderRadius: 12,
                  padding: '11px 12px',
                }}
              >
                <Text style={{ color: cssVar.colorTextSecondary, fontSize: 12 }}>{label}</Text>
                <Text style={{ fontSize: 12, fontWeight: 600 }}>{value}</Text>
              </Flexbox>
            ))}
          </Flexbox>
        </FloatingSheet>
      </div>
    </DemoSection>
  );
};

export default () => (
  <Flexbox gap={20} padding={16} style={{ margin: '0 auto', maxWidth: 680 }}>
    <OverlayWorkspaceDemo />
    <ControlledSnapDemo />
  </Flexbox>
);
