import {
  getDisplayName,
  getMutatedHostFibers,
  getType,
  instrument,
  isCompositeFiber,
  traverseContexts,
  traverseProps,
  traverseRenderedFibers,
  traverseState,
} from 'bippy';

const bench = { byComponent: {}, lastRenderAt: 0 };
window.__renderBench = bench;

const entryFor = (name) =>
  (bench.byComponent[name] ??= {
    context: 0,
    mounts: 0,
    parent: 0,
    props: 0,
    renders: 0,
    state: 0,
    unnecessary: 0,
  });

const changed = (next, prev) => !Object.is(next, prev);

// Effect hooks get a fresh memoizedState object every render; only hooks with an update queue are state.
const stateChanged = (fiber) =>
  traverseState(
    fiber,
    (next, prev) => Boolean(next?.queue) && changed(next.memoizedState, prev?.memoizedState),
  );

instrument({
  onCommitFiberRoot: (_rendererId, root) => {
    traverseRenderedFibers(root, (fiber, phase) => {
      if (!isCompositeFiber(fiber) || phase === 'unmount') return;
      bench.lastRenderAt = performance.now();
      const entry = entryFor(getDisplayName(getType(fiber.type)) || 'Anonymous');
      entry.renders++;
      if (phase === 'mount') {
        entry.mounts++;
        return;
      }
      const props = traverseProps(fiber, (_name, next, prev) => changed(next, prev));
      const state = stateChanged(fiber);
      const context = traverseContexts(fiber, (next, prev) =>
        changed(next?.memoizedValue, prev?.memoizedValue),
      );
      if (props) entry.props++;
      if (state) entry.state++;
      if (context) entry.context++;
      if (!props && !state && !context) entry.parent++;
      if (getMutatedHostFibers(fiber).length === 0) entry.unnecessary++;
    });
  },
});
