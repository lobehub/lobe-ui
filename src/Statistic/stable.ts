import { stableClasses } from '@/utils/bem';

export const statisticClasses = stableClasses({
  block: 'statistic',
  dataAttributes: ['loading'],
  elements: ['title', 'value', 'prefix', 'number', 'suffix', 'skeleton'],
});
