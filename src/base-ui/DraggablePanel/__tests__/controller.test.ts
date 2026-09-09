import type { PanelControllerOptions } from '../core/controller';
import { createPanelController } from '../core/controller';

const baseOptions = (overrides: Partial<PanelControllerOptions> = {}): PanelControllerOptions => ({
  defaultSize: 280,
  expand: true,
  max: 500,
  min: 200,
  placement: 'left',
  size: 280,
  ...overrides,
});

describe('panel controller', () => {
  test('drag grows a left panel and reports the committed size', () => {
    const onSizeChange = vi.fn();
    const panel = createPanelController(baseOptions({ onSizeChange }));

    panel.drag.start();
    panel.drag.move({ x: 60, y: 0 });
    expect(panel.motion.size.get()).toBe(340);

    panel.drag.end();
    expect(onSizeChange).toHaveBeenCalledWith(340, 60);
  });

  test('drag shrinks a right panel when the pointer moves right', () => {
    const panel = createPanelController(baseOptions({ placement: 'right' }));

    panel.drag.start();
    panel.drag.move({ x: 40, y: 0 });
    expect(panel.motion.size.get()).toBe(240);
  });

  test('clamps to min and max', () => {
    const panel = createPanelController(baseOptions());

    panel.drag.start();
    panel.drag.move({ x: 9999, y: 0 });
    expect(panel.motion.size.get()).toBe(500);
    panel.drag.move({ x: -9999, y: 0 });
    expect(panel.motion.size.get()).toBe(200);
  });

  test('collapseThreshold previews collapse and commits the pre-drag size', () => {
    const onExpandChange = vi.fn();
    const onSizeChange = vi.fn();
    const panel = createPanelController(
      baseOptions({ collapseThreshold: 150, min: 100, onExpandChange, onSizeChange }),
    );

    panel.drag.start();
    panel.drag.move({ x: -200, y: 0 });
    expect(panel.motion.size.get()).toBe(0);
    expect(panel.state.collapsing).toBe(true);

    panel.drag.move({ x: -50, y: 0 });
    expect(panel.state.collapsing).toBe(false);
    expect(onExpandChange).not.toHaveBeenCalled();

    panel.drag.move({ x: -200, y: 0 });
    panel.drag.end();
    expect(onExpandChange).toHaveBeenCalledWith(false);
    expect(onSizeChange).toHaveBeenCalledWith(280, 0);
    expect(panel.motion.content.get()).toBe(280);
  });

  test('cancel restores the pre-drag size', () => {
    const onSizeChange = vi.fn();
    const panel = createPanelController(baseOptions({ onSizeChange }));

    panel.drag.start();
    panel.drag.move({ x: 100, y: 0 });
    panel.drag.cancel();

    expect(panel.motion.size.get()).toBe(280);
    expect(onSizeChange).not.toHaveBeenCalled();
  });

  test('arrow keys step along the panel axis only', () => {
    const onSizeChange = vi.fn();
    const panel = createPanelController(baseOptions({ onSizeChange }));
    const key = (init: Partial<{ key: string; shiftKey: boolean }>) => ({
      key: 'ArrowRight',
      preventDefault: vi.fn(),
      shiftKey: false,
      ...init,
    });

    panel.resizeByKey(key({}));
    expect(onSizeChange).toHaveBeenLastCalledWith(290, 10);

    panel.resizeByKey(key({ key: 'ArrowLeft', shiftKey: true }));
    expect(onSizeChange).toHaveBeenLastCalledWith(230, -50);

    onSizeChange.mockClear();
    panel.resizeByKey(key({ key: 'ArrowUp' }));
    expect(onSizeChange).not.toHaveBeenCalled();
  });

  test('Home and End jump to the bounds, Enter toggles expand', () => {
    const onExpandChange = vi.fn();
    const onSizeChange = vi.fn();
    const panel = createPanelController(baseOptions({ onExpandChange, onSizeChange }));
    const key = (name: string) => ({ key: name, preventDefault: vi.fn(), shiftKey: false });

    panel.resizeByKey(key('End'));
    expect(onSizeChange).toHaveBeenLastCalledWith(500, 220);

    panel.resizeByKey(key('Home'));
    expect(onSizeChange).toHaveBeenLastCalledWith(200, -80);

    panel.resizeByKey(key('Enter'));
    expect(onExpandChange).toHaveBeenCalledWith(false);
  });

  test('sync collapses to zero while content keeps the expanded size', () => {
    const panel = createPanelController(baseOptions());

    panel.sync(baseOptions({ expand: false }));
    expect(panel.target).toBe(0);
    expect(panel.motion.content.get()).toBe(280);
  });

  test('reset reports the default size and expands', () => {
    const onExpandChange = vi.fn();
    const onSizeChange = vi.fn();
    const panel = createPanelController(
      baseOptions({ expand: false, onExpandChange, onSizeChange, size: 420 }),
    );

    panel.reset();
    expect(onExpandChange).toHaveBeenCalledWith(true);
    expect(onSizeChange).toHaveBeenCalledWith(280, 280);
  });
});
