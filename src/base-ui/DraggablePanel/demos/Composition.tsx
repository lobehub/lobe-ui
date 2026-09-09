import {
  DraggablePanelBody,
  DraggablePanelContainer,
  DraggablePanelContent,
  DraggablePanelFooter,
  DraggablePanelHandle,
  DraggablePanelHeader,
  DraggablePanelRoot,
  DraggablePanelToggle,
} from '@lobehub/ui/base-ui';

import { Flexbox } from '@/Flex';

export default () => (
  <Flexbox horizontal height={'100%'} style={{ minHeight: 400 }} width={'100%'}>
    <DraggablePanelRoot defaultSize={320} max={520} min={220} placement="left">
      <DraggablePanelToggle />
      <DraggablePanelContent>
        <DraggablePanelContainer style={{ flex: 1 }}>
          <DraggablePanelHeader title={'Panel'} />
          <DraggablePanelBody>Composed from atoms.</DraggablePanelBody>
          <DraggablePanelFooter>Footer</DraggablePanelFooter>
        </DraggablePanelContainer>
      </DraggablePanelContent>
      <DraggablePanelHandle />
    </DraggablePanelRoot>
    <Flexbox padding={24} style={{ flex: 1 }}>
      Content
    </Flexbox>
  </Flexbox>
);
