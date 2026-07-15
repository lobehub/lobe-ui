import { createDescriptorPromiseCache } from './descriptorPromiseCache';

it('evicts rejected loads so a transient descriptor failure can be retried', async () => {
  const descriptor = { id: 'recovered' };
  const loader = vi
    .fn<() => Promise<typeof descriptor>>()
    .mockRejectedValueOnce(new Error('Transient failure'))
    .mockResolvedValueOnce(descriptor);
  const cache = createDescriptorPromiseCache<typeof descriptor>();

  await expect(cache.load('source', loader)).rejects.toThrow('Transient failure');
  await expect(cache.load('source', loader)).resolves.toBe(descriptor);
  expect(loader).toHaveBeenCalledTimes(2);
});

it('clears resolved descriptor promises for an HMR generation change', async () => {
  const cache = createDescriptorPromiseCache<{ version: number }>();
  const first = vi.fn(async () => ({ version: 1 }));
  const second = vi.fn(async () => ({ version: 2 }));

  await expect(cache.load('source', first)).resolves.toEqual({ version: 1 });
  cache.clear();
  await expect(cache.load('source', second)).resolves.toEqual({ version: 2 });

  expect(first).toHaveBeenCalledTimes(1);
  expect(second).toHaveBeenCalledTimes(1);
});
