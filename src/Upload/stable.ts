import { stableClasses } from '@/utils/bem';

export const uploadClasses = stableClasses({
  block: 'upload',
  dataAttributes: ['dragger', 'drag-over'],
  elements: ['input', 'icon', 'title', 'description'],
});

export const uploadDraggerClasses = stableClasses({
  block: 'upload-dragger',
  elements: [],
});
