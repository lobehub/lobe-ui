import { Markdown } from '@lobehub/ui';

const content = `针对该代码，需要考虑以下数据场景：

1. **拖拽节点到画布上**：模拟拖拽一个节点到画布上并释放鼠标。期望画布上会新增一个对应类型的节点。
2. **拖拽节点到画布外**：模拟拖拽一个节点到画布外并释放鼠标。期望画布上不会新增任何节点。
3. **拖拽节点时移动鼠标**：模拟拖拽一个节点移动鼠标，期望节点跟随鼠标移动。
4. **取消拖拽节点**：模拟拖拽一个节点并在拖拽过程中取消拖拽，期望画布上不会新增任何节点。

针对以上场景，可以编写如下的 jest 单元测试代码：

\`\`\`javascript
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useDropNodeOnCanvas } from './useDropNodeOnCanvas';

describe('useDropNodeOnCanvas', () => {
  it('should add node to canvas when drop node on canvas', () => {
    const { result } = renderHook(() => useDropNodeOnCanvas());

    act(() => {
      result.current.onDragMove({ over: { rect: { left: 0 } }, activatorEvent: { clientX: 100 }, delta: { x: 0 } });
    });
    act(() => {
      result.current.onDragEnd({
        over: { rect: { left: 0 } },
        activatorEvent: { clientX: 100, clientY: 100 },
        active: { data: { current: { type: 'start' } } },
        delta: { x: 0, y: 0 },
      });
    });

    expect(result.current).toBe(false);
    expect(instance.getNodes().length).toBe(1);
    expect(instance.getNodes()[0].type).toBe('start');
  });

  it('should not add node to canvas when drop node outside canvas', () => {
    const { result } = renderHook(() => useDropNodeOnCanvas());

    act(() => {
      result.current.onDragMove({ over: null, activatorEvent: { clientX: 100 }, delta: { x: 0 } });
    });
    act(() => {
      result.current.onDragEnd({
        over: null,
        activatorEvent: { clientX: 100, clientY: 100 },
        active: { data: { current: { type: 'start' } } },
        delta: { x: 0, y: 0 },
      });
    });

    expect(result.current).toBe(false);
    expect(instance.getNodes().length).toBe(0);
  });

  it('should move node when drag node on canvas', () => {
    const { result } = renderHook(() => useDropNodeOnCanvas());

    act(() => {
      result.current.onDragMove({ over: { rect: { left: 0 } }, activatorEvent: { clientX: 100 }, delta: { x: 0 } });
    });

    expect(result.current).toBe(true);
  });

  it('should not add node to canvas when cancel drag node', () => {
    const { result } = renderHook(() => useDropNodeOnCanvas());

    act(() => {
      result.current.onDragMove({ over: { rect: { left: 0 } }, activatorEvent: { clientX: 100 }, delta: { x: 0 } });
    });
    act(() => {
      result.current.onDragCancel();
    });

    expect(result.current).toBe(false);
    expect(instance.getNodes().length).toBe(0);
  });
});
\`\`\``;
export default () => <Markdown>{content}</Markdown>;
