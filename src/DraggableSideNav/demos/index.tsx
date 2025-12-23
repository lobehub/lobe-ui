import { DraggableSideNav } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

import { Flexbox } from '@/Flex';
import sideNavMessages from '@/i18n/resources/en/sideNav';
import { useTranslation } from '@/i18n/useTranslation';

import { DemoBody } from './Body';
import { DemoFooter } from './Footer';
import { DemoHeader } from './Header';

export default () => {
  const [width, setWidth] = useState(300);
  const [expand, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState<string>('home');
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

  // Type-safe props
  const sideNavProps = {
    ...control,
    placement: 'left' as const,
  };

  return (
    <StoryBook levaStore={store} noPadding>
      <Flexbox height={'100%'} horizontal width={'100%'}>
        <DraggableSideNav
          body={(expand) => (
            <DemoBody activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
          expand={expand}
          footer={(expand) => <DemoFooter expand={expand} />}
          header={(expand) => (
            <DemoHeader activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
          onExpandChange={setExpand}
          onWidthChange={(_, width) => setWidth(width)}
          width={width}
          {...sideNavProps}
        />

        <Flexbox flex={1} gap={16} padding={24}>
          <div>
            <h2 style={{ marginBottom: '8px' }}>{t('sideNav.demoTitle')}</h2>
            <p style={{ fontSize: '14px', margin: 0 }}>{t('sideNav.demoSubtitle')}</p>
          </div>

          <Flexbox gap={8}>
            <div>
              <strong>{t('sideNav.demoActiveLabel')}:</strong> {activeKey}
            </div>
            <div>
              <button
                onClick={() => setExpand(!expand)}
                style={{
                  background: expand ? '#1890ff' : '#52c41a',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 16px',
                }}
                type="button"
              >
                {expand ? t('sideNav.collapse') : t('sideNav.expand')}
              </button>
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

          <div style={{ color: '#999', fontSize: '12px' }}>{t('sideNav.demoHint')}</div>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
