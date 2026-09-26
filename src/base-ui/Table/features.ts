import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

export const tableFeatureSet = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

export type TableFeatureSet = typeof tableFeatureSet;
