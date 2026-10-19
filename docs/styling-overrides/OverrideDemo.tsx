import { DraggablePanel, Flexbox, Popover, Switch } from '@lobehub/ui';

const overrides = `
.lobe-switch__thumb { background: rgb(255, 0, 0); }
.lobe-popover { border-radius: 3px; }
.lobe-draggable-panel__content { background: rgb(0, 0, 255); }
`;

export function OverrideDemo() {
  return (
    <Flexbox horizontal gap={24}>
      <style>{overrides}</style>
      <div id="override-switch">
        <Switch defaultChecked />
      </div>
      <Popover open content="Overridden radius">
        <span id="override-popover">Popover trigger</span>
      </Popover>
      <div id="override-panel" style={{ display: 'flex', height: 120, position: 'relative' }}>
        <DraggablePanel placement="left">
          <Flexbox padding={12}>Panel</Flexbox>
        </DraggablePanel>
      </div>
    </Flexbox>
  );
}
