import { Button, DraggableSideNav, Flexbox, Text } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useRef, useState } from 'react';

import { useSize } from '@/hooks/useSize';
import sideNavMessages from '@/i18n/resources/en/sideNav';
import { useTranslation } from '@/i18n/useTranslation';

import { DemoBody } from './Body';
import { DemoFooter } from './Footer';
import { DemoHeader } from './Header';

export default () => {
  const [width, setWidth] = useState(300);
  const [expand, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState<string>('home');
  const previewRef = useRef<HTMLDivElement>(null);
  const previewSize = useSize(previewRef);
  const store = useCreateStore();
  const { t } = useTranslation(sideNavMessages);

  const control = useControls(
    {
      defaultExpand: true,
      defaultWidth: {
        step: 1,
        value: 280,
      },
      maxWidth: {
        step: 1,
        value: 320,
      },
      minWidth: {
        max: 200,
        min: 48,
        step: 1,
        value: 54,
      },
      resizable: true,
      showHandle: true,
      showHandleWhenCollapsed: false,
    },
    { store },
  );

  const compact = previewSize !== undefined && previewSize.width < 480;
  // Keep room for the main pane when the docs toolbar constrains the preview width.
  const maxWidth = previewSize
    ? Math.max(48, Math.min(control.maxWidth, Math.floor(previewSize.width * 0.55)))
    : control.maxWidth;
  const minWidth = Math.min(control.minWidth, maxWidth);

  return (
    <StoryBook noPadding levaStore={store}>
      <Flexbox horizontal height={'100%'} ref={previewRef} width={'100%'}>
        <DraggableSideNav
          {...control}
          expand={expand}
          footer={(expand) => <DemoFooter expand={expand} />}
          maxWidth={maxWidth}
          minWidth={minWidth}
          placement="left"
          width={Math.max(minWidth, Math.min(width, maxWidth))}
          body={(expand) => (
            <DemoBody activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
          header={(expand) => (
            <DemoHeader activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
          onExpandChange={setExpand}
          onWidthChange={(_, width) => setWidth(width)}
        />

        <Flexbox
          allowShrink
          flex={1}
          gap={16}
          padding={compact ? 12 : 24}
          style={{ overflowWrap: 'anywhere' }}
        >
          <div>
            <h2 style={{ marginBottom: '8px' }}>{t('sideNav.demoTitle')}</h2>
            <p style={{ fontSize: '14px', margin: 0 }}>{t('sideNav.demoSubtitle')}</p>
          </div>

          <Flexbox gap={8}>
            <div>
              <strong>{t('sideNav.demoActiveLabel')}:</strong> {activeKey}
            </div>
            <div>
              <Button type="primary" onClick={() => setExpand((expanded) => !expanded)}>
                {expand ? t('sideNav.collapse') : t('sideNav.expand')}
              </Button>
            </div>
            <div style={{ fontSize: '13px' }}>
              <strong>{t('sideNav.demoFeaturesTitle')}:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>
                  <strong>{t('sideNav.demoFeatureSmartHandleTitle')}:</strong>{' '}
                  {t('sideNav.demoFeatureSmartHandleDesc')}
                </li>
                <li>
                  <strong>{t('sideNav.demoFeatureResizeTitle')}:</strong>{' '}
                  {t('sideNav.demoFeatureResizeDesc')}
                </li>
                <li>
                  <strong>{t('sideNav.demoFeatureAutoCollapseTitle')}:</strong>{' '}
                  {t('sideNav.demoFeatureAutoCollapseDesc')}
                </li>
                <li>
                  <strong>{t('sideNav.demoFeaturePerformanceTitle')}:</strong>{' '}
                  {t('sideNav.demoFeaturePerformanceDesc')}
                </li>
              </ul>
            </div>
          </Flexbox>

          <Text fontSize={12} type="secondary">
            {t('sideNav.demoHint')}
          </Text>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
