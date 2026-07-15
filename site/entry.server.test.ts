// @vitest-environment node

import type { EntryContext } from 'react-router';

import handleRequest from './entry.server';

const prerenderMock = vi.hoisted(() => vi.fn());

vi.mock('react-dom/static', () => ({ prerender: prerenderMock }));

it('rejects a static response when React postpones unresolved content', async () => {
  const prelude = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.close();
    },
  });
  prerenderMock.mockResolvedValue({ postponed: {}, prelude });

  await expect(
    handleRequest(
      new Request('https://ui.example.com/changelog'),
      200,
      new Headers(),
      {} as EntryContext,
    ),
  ).rejects.toThrow(/incomplete static prerender.*\/changelog/i);
});
