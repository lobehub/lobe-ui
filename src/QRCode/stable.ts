import { stableClasses } from '@/utils/bem';

export const qrCodeClasses = stableClasses({
  block: 'qr-code',
  dataAttributes: ['status', 'bordered'],
  elements: ['code', 'icon', 'overlay', 'title', 'refresh'],
});
