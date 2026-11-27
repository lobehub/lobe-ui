import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

export interface ReceiptItem {
  name: string;
  /** Shown under the name, e.g. "Fine nib, engraved". */
  note?: string;
  /** Unit price; the line shows `price × qty`. */
  price: number;
  /** @default 1 */
  qty?: number;
}

/** Tint of the status badge; guessed from the status text when not set. */
export type ReceiptStatusTone = 'positive' | 'negative' | 'warning';

export interface ReceiptCardClassNames {
  footer?: string;
  header?: string;
  items?: string;
  root?: string;
  totals?: string;
}

export interface ReceiptCardStyles {
  footer?: CSSProperties;
  header?: CSSProperties;
  items?: CSSProperties;
  root?: CSSProperties;
  totals?: CSSProperties;
}

export interface ReceiptCardTexts {
  discount?: string;
  /** Shipping of `0`. @default 'Free' */
  free?: string;
  /** Order line; `{id}` is replaced by `orderId`. @default 'Order {id}' */
  order?: string;
  shipping?: string;
  subtotal?: string;
  tax?: string;
  total?: string;
}

export type ReceiptCardVariant = 'default' | 'a2ui';

export interface ReceiptCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  classNames?: ReceiptCardClassNames;
  /** ISO 4217 code for the amounts. @default 'USD' */
  currency?: string;
  date?: string;
  /** Subtracted from the total (sign ignored). */
  discount?: number;
  /** Header icon; a receipt by default. */
  icon?: ReactNode;
  /** Line items. With none, two placeholder rows show. */
  items?: ReceiptItem[];
  /** Locale of the amounts. @default 'en-US' */
  locale?: string;
  merchant: string;
  orderId?: string;
  /** Payment method, e.g. "Visa ending 4242", in the footer. */
  payment?: string;
  ref?: Ref<HTMLDivElement>;
  /** `0` reads "Free". */
  shipping?: number;
  /** Badge text, e.g. "Paid", "Refunded", "Pending". */
  status?: string;
  /** Badge tint; guessed from `status` when not set (paid / refunded / anything else). */
  statusTone?: ReceiptStatusTone;
  styles?: ReceiptCardStyles;
  tax?: number;
  /** Overrides the built-in `receiptCard.*` texts. */
  texts?: ReceiptCardTexts;
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, `Tag` status).
   * `a2ui`: the A2UI playground receipt (14px card, quantity chips, dashed rule, footer strip).
   * @default 'default'
   */
  variant?: ReceiptCardVariant;
}
