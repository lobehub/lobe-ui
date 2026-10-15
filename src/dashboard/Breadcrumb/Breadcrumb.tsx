'use client';

import * as stylex from '@stylexjs/stylex';

import { styles } from './style';
import type { BreadcrumbItem, BreadcrumbProps } from './type';

function CrumbLink({
  className,
  item,
  renderLink,
}: {
  className: string;
  item: BreadcrumbItem;
  renderLink?: BreadcrumbProps['renderLink'];
}) {
  const href = item.href ?? '#';
  if (renderLink && item.href) {
    return renderLink({
      children: item.label,
      className,
      href: item.href,
      onClick: item.onClick,
    });
  }
  return (
    <a
      className={className}
      href={href}
      onClick={(event) => {
        if (!item.onClick) return;
        event.preventDefault();
        item.onClick();
      }}
    >
      {item.label}
    </a>
  );
}

function Breadcrumb({ items, label = 'Breadcrumb', renderLink }: BreadcrumbProps) {
  return (
    <nav aria-label={label} {...stylex.props(styles.root)}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const linked = Boolean(item.href) && !last;
        return (
          <span key={`${index}`} {...stylex.props(styles.crumb, item.optional && styles.optional)}>
            {linked ? (
              <CrumbLink
                className={stylex.props(styles.link).className ?? ''}
                item={item}
                renderLink={renderLink}
              />
            ) : (
              <span
                aria-current={last ? 'page' : undefined}
                title={typeof item.label === 'string' ? item.label : undefined}
                {...stylex.props(last ? styles.page : styles.ancestor)}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <span aria-hidden {...stylex.props(styles.separator)}>
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
