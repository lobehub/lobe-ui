import type { TableLoadingConfig } from '@/Table/type';

import type { ProTableProps } from '../type';
import { useDelayedFlag } from './useDelayedFlag';

export const useProLoading = (
  loadingProp: ProTableProps['loading'],
  fetching: boolean,
  hasRequest: boolean,
) => {
  const config = typeof loadingProp === 'object' ? loadingProp : undefined;
  const { delay, ...spin } = config ?? {};
  const raw =
    config === undefined
      ? ((loadingProp as boolean | undefined) ?? fetching)
      : (config.spinning ?? (hasRequest ? fetching : true));
  const loading = useDelayedFlag(raw, delay);
  const tableLoading: boolean | TableLoadingConfig = config
    ? { ...spin, spinning: loading }
    : loading;
  return { loading, tableLoading };
};
