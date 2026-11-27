import { stableClasses } from '@/utils/bem';

export const receiptCardClasses = stableClasses({
  block: 'receipt-card',
  dataAttributes: ['status', 'variant'],
  elements: [
    'header',
    'icon',
    'merchant',
    'meta',
    'status',
    'items',
    'item',
    'qty',
    'name',
    'note',
    'price',
    'totals',
    'row',
    'total',
    'footer',
  ],
});
