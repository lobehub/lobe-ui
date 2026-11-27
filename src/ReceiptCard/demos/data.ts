import type { ReceiptCardProps } from '@lobehub/ui';

// Sample data from the A2UI playground `ReceiptCard` (CopilotKit a2ui-playground, MIT).
export const receipt: ReceiptCardProps = {
  currency: 'USD',
  date: 'Oct 14, 2026',
  discount: 10,
  items: [
    { name: 'Dot grid notebook, A5', price: 18, qty: 2 },
    { name: 'Brass fountain pen', note: 'Fine nib, engraved', price: 64, qty: 1 },
    { name: 'Ink cartridges, blue black', price: 6.5, qty: 3 },
  ],
  merchant: 'Fieldnote Supply Co.',
  orderId: '#FN-48213',
  payment: 'Visa ending 4242',
  shipping: 0,
  status: 'Paid',
  tax: 9.62,
};
