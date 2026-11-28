import { render, screen } from '@testing-library/react';

import ReceiptCard from './ReceiptCard';

const props = {
  date: 'Oct 14, 2026',
  discount: 10,
  items: [
    { name: 'Dot grid notebook, A5', price: 18, qty: 2 },
    { name: 'Brass fountain pen', note: 'Fine nib, engraved', price: 64 },
    { name: 'Ink cartridges, blue black', price: 6.5, qty: 3 },
  ],
  merchant: 'Fieldnote Supply Co.',
  orderId: '#FN-48213',
  payment: 'Visa ending 4242',
  shipping: 0,
  status: 'Paid',
  tax: 9.62,
};

describe('ReceiptCard', () => {
  test('renders items, computed totals, status and payment', () => {
    const { container } = render(<ReceiptCard {...props} />);
    expect(screen.getByText('Fieldnote Supply Co.')).toBeTruthy();
    expect(screen.getByText('Order #FN-48213 · Oct 14, 2026')).toBeTruthy();
    expect(container.querySelectorAll('.lobe-receipt-card__item')).toHaveLength(3);
    expect(screen.getByText('$36.00')).toBeTruthy();
    expect(screen.getByText('$119.50')).toBeTruthy();
    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('-$10.00')).toBeTruthy();
    expect(screen.getByText('$119.12')).toBeTruthy();
    expect(screen.getByText('Visa ending 4242')).toBeTruthy();
    expect((container.firstElementChild as HTMLElement).dataset.status).toBe('positive');
  });

  test('tints the status from its text and shows placeholders without items', () => {
    const { container } = render(<ReceiptCard merchant="Shop" status="Refunded" />);
    expect((container.firstElementChild as HTMLElement).dataset.status).toBe('negative');
    expect(container.querySelectorAll('.lobe-receipt-card__item')).toHaveLength(0);
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<ReceiptCard {...props} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    const defaultClass = root.className;
    rerender(<ReceiptCard {...props} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(container.querySelector('.lobe-receipt-card__meta')?.textContent).toBe(
      'Order #FN-48213  ·  Oct 14, 2026',
    );
    expect(root.className).not.toBe(defaultClass);
  });
});
