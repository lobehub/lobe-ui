import { DraggableSideNav } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { DemoBody } from './Body';
import { DemoFooter } from './Footer';
import { DemoHeader } from './Header';

export default () => {
  const [width, setWidth] = useState(300);
  const [expand, setExpand] = useState(true);
  const [activeKey, setActiveKey] = useState<string>('home');
  const store = useCreateStore();

  const control = useControls(
    {
      'animation.blur': false,
      'animation.body': false,
      'animation.fade': false,
      'animation.footer': false,
      'animation.header': false,
      'defaultExpand': true,
      'defaultWidth': {
        step: 1,
        value: 280,
      },
      'maxWidth': {
        step: 1,
        value: 320,
      },
      'minWidth': {
        max: 200,
        min: 48,
        step: 1,
        value: 54,
      },
      'resizable': true,
      'showHandle': true,
      'showHandleWhenCollapsed': false,
    },
    { store },
  );

  const {
    'animation.blur': animationBlur,
    'animation.body': animationBody,
    'animation.fade': animationFade,
    'animation.footer': animationFooter,
    'animation.header': animationHeader,
    ...draggableProps
  } = control;

  // Transform animation controls to animation object
  const animation = {
    blur: animationBlur,
    body: animationBody,
    fade: animationFade,
    footer: animationFooter,
    header: animationHeader,
  };

  // Type-safe props
  const sideNavProps = {
    ...draggableProps,
    animation,
    placement: 'left' as const,
  };

  return (
    <StoryBook levaStore={store} noPadding>
      <Flexbox height={'100%'} horizontal width={'100%'}>
        <DraggableSideNav
          expand={expand}
          onExpandChange={setExpand}
          onWidthChange={(_, width) => setWidth(width)}
          width={width}
          {...sideNavProps}
          footer={(expand) => <DemoFooter expand={expand} />}
          header={(expand) => (
            <DemoHeader activeKey={activeKey} expand={expand} onSelect={setActiveKey} />
          )}
        >
          {(expand) => <DemoBody activeKey={activeKey} expand={expand} onSelect={setActiveKey} />}
        </DraggableSideNav>

        <Flexbox flex={1} gap={16} padding={24}>
          <div>
            <h2 style={{ marginBottom: '8px' }}>DraggableSideNav Demo</h2>
            <p style={{ fontSize: '14px', margin: 0 }}>
              A workspace-style side panel with smooth animations
            </p>
          </div>

          <Flexbox gap={8}>
            <div>
              <strong>Active:</strong> {activeKey}
            </div>
            <div style={{ fontSize: '13px' }}>
              ✨ <strong>Enhanced Features:</strong>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>
                  <strong>Smooth Animations:</strong> 400ms transitions with natural easing
                </li>
                <li>
                  <strong>Flexible Animation:</strong> Independent control of fade and blur effects
                </li>
                <li>
                  <strong>Smart Handle:</strong> Hover to reveal, scales on interaction
                </li>
                <li>
                  <strong>Enhanced Resize:</strong> Visual feedback with glowing indicator
                </li>
                <li>
                  <strong>Auto-collapse:</strong> Drag below threshold for smart collapse
                </li>
              </ul>
            </div>
          </Flexbox>

          <div style={{ color: '#999', fontSize: '12px' }}>
            💡 Try toggling animation.fade and animation.blur independently in the controls panel →
          </div>
        </Flexbox>
      </Flexbox>
    </StoryBook>
  );
};
