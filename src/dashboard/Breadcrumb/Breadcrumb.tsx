'use client';

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
    <nav aria-label={label} className={styles.root}>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const linked = Boolean(item.href) && !last;
        return (
          <span className={item.optional ? styles.optional : undefined} key={`${index}`}>
            {linked ? (
              <CrumbLink className={styles.link} item={item} renderLink={renderLink} />
            ) : (
              <span
                aria-current={last ? 'page' : undefined}
                className={last ? styles.page : styles.ancestor}
                title={typeof item.label === 'string' ? item.label : undefined}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <span aria-hidden className={styles.separator}>
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
