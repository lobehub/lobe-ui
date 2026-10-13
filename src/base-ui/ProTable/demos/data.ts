import type { ProTableRequestData } from '@lobehub/ui/base-ui';

export type ModelStatus = 'online' | 'running' | 'error' | 'offline';

export interface ModelRow {
  calls: number;
  createdAt: string;
  id: string;
  model: string;
  owner: string;
  progress: number;
  provider: string;
  spend: number;
  status: ModelStatus;
}

export const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Qwen'];
const OWNERS = ['Ada', 'Bob', 'Cleo', 'Dan', 'Eve', 'Finn'];
const STATUSES: ModelStatus[] = ['online', 'running', 'error', 'offline'];

export const statusEnum = {
  error: { status: 'Error', text: 'Error' },
  offline: { status: 'Default', text: 'Offline' },
  online: { status: 'Success', text: 'Online' },
  running: { status: 'Processing', text: 'Running' },
} as const;

export const providerEnum = Object.fromEntries(PROVIDERS.map((name) => [name, { text: name }]));

const day = (index: number) => {
  const date = new Date(2026, 0, 1 + ((index * 5) % 270));
  return date.toISOString();
};

export const rows: ModelRow[] = Array.from({ length: 86 }, (_, index) => {
  const provider = PROVIDERS[index % PROVIDERS.length];
  return {
    calls: ((index * 7919) % 60_000) + 1000,
    createdAt: day(index),
    id: String(index + 1),
    model: `${provider.toLowerCase()}-model-${String(index + 1).padStart(2, '0')}`,
    owner: OWNERS[index % OWNERS.length],
    progress: (index * 37) % 101,
    provider,
    spend: Math.round(((index * 3571) % 30_000) + 500) / 100,
    status: STATUSES[(index * 3) % STATUSES.length],
  };
});

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * A fake server: filters by any matching param (substring for text, exact for enums, a
 * `startTime` / `endTime` range on `createdAt`), sorts by `sort`, then pages.
 */
export const mockRequest = async (
  params: Record<string, any> & { current?: number; pageSize?: number },
  sort: Record<string, 'ascend' | 'descend' | null> = {},
  filter: Record<string, (string | number | boolean)[] | null> = {},
): Promise<Partial<ProTableRequestData<ModelRow>>> => {
  await wait(400);
  const { current = 1, pageSize = 10, keyword, startTime, endTime, ...rest } = params;
  let list = rows.filter((row) => {
    if (keyword && !row.model.includes(String(keyword))) return false;
    if (startTime && row.createdAt.slice(0, 10) < startTime) return false;
    if (endTime && row.createdAt.slice(0, 10) > endTime) return false;
    return Object.entries(rest).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      const cell = (row as any)[key];
      if (cell === undefined) return true;
      if (Array.isArray(value)) return value.map(String).includes(String(cell));
      if (typeof cell === 'number') return cell === Number(value);
      return String(cell).toLowerCase().includes(String(value).toLowerCase());
    });
  });
  Object.entries(filter).forEach(([key, values]) => {
    if (values?.length)
      list = list.filter((row) => values.map(String).includes(String((row as any)[key])));
  });
  const [sortKey, order] = Object.entries(sort).find(([, value]) => value) ?? [];
  if (sortKey && order) {
    list = [...list].sort((a, b) => {
      const x = (a as any)[sortKey];
      const y = (b as any)[sortKey];
      const result = typeof x === 'number' ? x - y : String(x).localeCompare(String(y));
      return order === 'ascend' ? result : -result;
    });
  }
  return {
    data: list.slice((current - 1) * pageSize, current * pageSize),
    success: true,
    total: list.length,
  };
};
