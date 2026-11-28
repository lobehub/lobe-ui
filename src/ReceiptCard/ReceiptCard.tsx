'use client';

import clsx from 'clsx';
import { CreditCard, Receipt } from 'lucide-react';
import { memo } from 'react';

import cardsMessages from '@/i18n/resources/en/cards';
import { useTranslation } from '@/i18n/useTranslation';
import { domainStyles } from '@/internal/a2ui/domain';
import { a2uiStyles, a2uiToneSoft } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { receiptCardClasses } from './stable';
import { styles } from './style';
import type { ReceiptCardProps, ReceiptStatusTone } from './type';

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const formatMoney = (value: number, currency: string, locale: string) => {
  try {
    return new Intl.NumberFormat(locale, { currency, style: 'currency' }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
};

/** Status tint from the badge text: paid / refunded / anything else. */
const receiptStatusTone = (status: string): ReceiptStatusTone =>
  /paid|complete|deliver|success|confirm/i.test(status)
    ? 'positive'
    : /refund|cancel|fail/i.test(status)
      ? 'negative'
      : 'warning';

const TAG_COLOR: Record<ReceiptStatusTone, string> = {
  negative: 'error',
  positive: 'success',
  warning: 'warning',
};

/**
 * An order receipt: merchant, order id and date, a status badge, line items with quantities,
 * subtotal, shipping, discount, tax and total, and the payment method. A plain lobe-ui card
 * (`default`) or the A2UI playground card (`a2ui`). Adapted from CopilotKit a2ui-playground
 * (MIT), `renderers/domain.tsx` ReceiptCard.
 */
const ReceiptCard = memo<ReceiptCardProps>(
  ({
    className,
    classNames,
    currency = 'USD',
    date,
    discount: discountProp,
    icon,
    items: itemsProp,
    locale = 'en-US',
    merchant,
    orderId,
    payment,
    ref,
    shipping: shippingProp,
    status,
    statusTone,
    style,
    styles: customStyles,
    tax: taxProp,
    texts,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(cardsMessages);
    const money = (value: number) => formatMoney(value, currency, locale);
    const items = (itemsProp ?? []).filter((item) => item && isNum(item.price));
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * (isNum(item.qty) ? item.qty : 1),
      0,
    );
    const tax = isNum(taxProp) ? taxProp : 0;
    const shipping = isNum(shippingProp) ? shippingProp : 0;
    const discount = Math.abs(isNum(discountProp) ? discountProp : 0);
    const total = subtotal + tax + shipping - discount;
    const tone = status ? (statusTone ?? receiptStatusTone(status)) : undefined;
    const rows = [
      { label: texts?.subtotal ?? t('receiptCard.subtotal'), value: money(subtotal) },
      shipping
        ? { label: texts?.shipping ?? t('receiptCard.shipping'), value: money(shipping) }
        : shippingProp === 0
          ? {
              label: texts?.shipping ?? t('receiptCard.shipping'),
              value: texts?.free ?? t('receiptCard.free'),
            }
          : null,
      discount
        ? {
            label: texts?.discount ?? t('receiptCard.discount'),
            positive: true,
            value: `-${money(discount)}`,
          }
        : null,
      tax ? { label: texts?.tax ?? t('receiptCard.tax'), value: money(tax) } : null,
    ].filter(Boolean) as { label: string; positive?: boolean; value: string }[];
    const meta = [
      orderId ? (texts?.order ?? t('receiptCard.order')).replace('{id}', orderId) : null,
      date,
    ]
      .filter(Boolean)
      .join(isA2ui ? '  ·  ' : ' · ');

    return (
      <div
        ref={ref}
        {...rest}
        {...styleProps(
          isA2ui
            ? [a2uiStyles.base, a2uiStyles.card, styles.root]
            : [domainStyles.dCard, styles.root],
          clsx(receiptCardClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-status={tone}
        data-variant={variant}
      >
        <div
          {...styleProps(
            styles.header,
            clsx(receiptCardClasses('header'), classNames?.header),
            customStyles?.header,
          )}
        >
          <div {...styleProps(styles.headerMain)}>
            <span
              {...styleProps([styles.icon, !isA2ui && styles.dIcon], receiptCardClasses('icon'))}
            >
              {icon ?? <Receipt aria-hidden size={16} />}
            </span>
            <span {...styleProps(styles.headerText)}>
              <span
                {...styleProps(
                  [styles.merchant, !isA2ui && styles.dMerchant],
                  receiptCardClasses('merchant'),
                )}
              >
                {merchant}
              </span>
              {meta ? (
                <span
                  {...styleProps(
                    [styles.meta, !isA2ui && styles.dMeta],
                    receiptCardClasses('meta'),
                  )}
                >
                  {meta}
                </span>
              ) : null}
            </span>
          </div>
          {status && tone ? (
            isA2ui ? (
              <span
                {...styleProps([styles.status, a2uiToneSoft[tone]], receiptCardClasses('status'))}
              >
                {status}
              </span>
            ) : (
              <Tag className={receiptCardClasses('status')} color={TAG_COLOR[tone]}>
                {status}
              </Tag>
            )
          ) : null}
        </div>
        <div {...styleProps([styles.rule, !isA2ui && styles.dLine])} />
        <div
          {...styleProps(
            styles.items,
            clsx(receiptCardClasses('items'), classNames?.items),
            customStyles?.items,
          )}
        >
          {items.length === 0
            ? [0, 1].map((i) => <div key={i} {...styleProps(styles.placeholder)} />)
            : items.map((item, i) => {
                const qty = isNum(item.qty) ? item.qty : 1;
                return (
                  <div
                    key={`${item.name}-${i}`}
                    {...styleProps(styles.item, receiptCardClasses('item'))}
                  >
                    <div {...styleProps(styles.itemMain)}>
                      <span
                        {...styleProps(
                          [styles.qty, !isA2ui && styles.dQty],
                          receiptCardClasses('qty'),
                        )}
                      >
                        {qty}
                      </span>
                      <span {...styleProps(styles.itemText)}>
                        <span
                          {...styleProps(
                            [styles.name, !isA2ui && styles.dName],
                            receiptCardClasses('name'),
                          )}
                        >
                          {item.name}
                        </span>
                        {item.note ? (
                          <span
                            {...styleProps(
                              [styles.note, !isA2ui && styles.dNote],
                              receiptCardClasses('note'),
                            )}
                          >
                            {item.note}
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <span
                      {...styleProps(
                        [styles.price, !isA2ui && styles.dText],
                        receiptCardClasses('price'),
                      )}
                    >
                      {money(item.price * qty)}
                    </span>
                  </div>
                );
              })}
        </div>
        <div {...styleProps([styles.dashed, !isA2ui && styles.dDashed])} />
        <div
          {...styleProps(
            styles.totals,
            clsx(receiptCardClasses('totals'), classNames?.totals),
            customStyles?.totals,
          )}
        >
          {rows.map((row) => (
            <div
              key={row.label}
              {...styleProps([styles.row, !isA2ui && styles.dRow], receiptCardClasses('row'))}
            >
              <span {...styleProps([styles.rowLabel, !isA2ui && styles.dRowLabel])}>
                {row.label}
              </span>
              <span {...styleProps([styles.rowValue, row.positive && styles.positive])}>
                {row.value}
              </span>
            </div>
          ))}
          <div
            {...styleProps([styles.total, !isA2ui && styles.dTotal], receiptCardClasses('total'))}
          >
            <span {...styleProps([styles.totalLabel, !isA2ui && styles.dTotalLabel])}>
              {texts?.total ?? t('receiptCard.total')}
            </span>
            <span {...styleProps([styles.totalAmount, !isA2ui && styles.dTotalAmount])}>
              {money(total)}
            </span>
          </div>
        </div>
        {payment ? (
          <div
            {...styleProps(
              [styles.footer, !isA2ui && styles.dFooter],
              clsx(receiptCardClasses('footer'), classNames?.footer),
              customStyles?.footer,
            )}
          >
            <CreditCard aria-hidden size={14} />
            {payment}
          </div>
        ) : null}
      </div>
    );
  },
);

ReceiptCard.displayName = 'ReceiptCard';

export default ReceiptCard;
