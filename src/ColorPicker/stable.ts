import { stableClasses } from '@/utils/bem';

export const colorPickerClasses = stableClasses({
  block: 'color-picker',
  dataAttributes: ['size', 'trigger'],
  elements: [
    'swatch',
    'text',
    'caret',
    'popup',
    'panel',
    'controls',
    'eye-dropper',
    'sliders',
    'compare',
  ],
});
