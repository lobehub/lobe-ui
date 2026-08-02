import { act, render } from '@testing-library/react';
import { useEffect } from 'react';

import Image from './Image';
import PreviewGroup, { usePreviewGroupContext } from './PreviewGroup';

vi.mock('antd-style', async (importOriginal) => {
  const actual = await importOriginal<typeof import('antd-style')>();
  return {
    ...actual,
    createStaticStyles: vi.fn((fn: any) => {
      const result = fn({ css: () => '', cssVar: new Proxy({}, { get: () => '' }) });
      return new Proxy(result, { get: (_target, key) => String(key) });
    }),
  };
});

type PreviewGroupContext = ReturnType<typeof usePreviewGroupContext>;

const Reporter = ({ onEntries }: { onEntries: (entries: string[]) => void }) => {
  const group = usePreviewGroupContext();
  useEffect(() => {
    onEntries(group?.getEntries().map((entry) => entry.src) ?? []);
  });
  return null;
};

const Harness = ({ onReady }: { onReady: (context: PreviewGroupContext) => void }) => {
  const group = usePreviewGroupContext();
  useEffect(() => {
    onReady(group);
  }, [group, onReady]);
  return null;
};

describe('PreviewGroup', () => {
  it('sorts entries by DOM order at read time, independent of registration order', () => {
    let context: PreviewGroupContext;
    render(
      <PreviewGroup>
        <Harness
          onReady={(ctx) => {
            context = ctx;
          }}
        />
      </PreviewGroup>,
    );

    const elementA = document.createElement('img');
    const elementB = document.createElement('img');
    document.body.append(elementB, elementA);

    let unregisterA: () => void = () => {};
    act(() => {
      unregisterA = context!.register({ getElement: () => elementA, id: 'a', src: 'a' });
      context!.register({ getElement: () => elementB, id: 'b', src: 'b' });
    });

    expect(context!.getEntries().map((entry) => entry.src)).toEqual(['b', 'a']);

    act(() => unregisterA());
    expect(context!.getEntries().map((entry) => entry.src)).toEqual(['b']);

    elementA.remove();
    elementB.remove();
  });

  it('unregisters an Image entry when it unmounts', () => {
    const onEntries = vi.fn();
    const { rerender } = render(
      <PreviewGroup>
        <Image alt="a" src="https://example.com/a.png" />
        <Image alt="b" src="https://example.com/b.png" />
        <Reporter onEntries={onEntries} />
      </PreviewGroup>,
    );

    expect(onEntries.mock.calls.at(-1)?.[0]).toEqual([
      'https://example.com/a.png',
      'https://example.com/b.png',
    ]);

    rerender(
      <PreviewGroup>
        <Image alt="b" src="https://example.com/b.png" />
        <Reporter onEntries={onEntries} />
      </PreviewGroup>,
    );

    expect(onEntries.mock.calls.at(-1)?.[0]).toEqual(['https://example.com/b.png']);
  });

  it('provides no context when enable is false', () => {
    let context: PreviewGroupContext = null;
    render(
      <PreviewGroup enable={false}>
        <Harness
          onReady={(ctx) => {
            context = ctx;
          }}
        />
      </PreviewGroup>,
    );

    expect(context).toBeNull();
  });
});
