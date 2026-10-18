'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { dashboardBreadcrumbClasses } from './stable';
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

function Breadcrumb({ className, items, label = 'Breadcrumb', renderLink }: BreadcrumbProps) {
  return (
    <nav
      aria-label={label}
      {...styleProps(styles.root, clsx(dashboardBreadcrumbClasses(), className))}
    >
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const linked = Boolean(item.href) && !last;
        return (
          <span
            key={`${index}`}
            {...styleProps(
              [styles.crumb, item.optional && styles.optional],
              dashboardBreadcrumbClasses('crumb'),
            )}
            {...toDataAttributes({ optional: item.optional })}
          >
            {linked ? (
              <CrumbLink
                item={item}
                renderLink={renderLink}
                className={
                  styleProps(styles.link, dashboardBreadcrumbClasses('link')).className ?? ''
                }
              />
            ) : (
              <span
                aria-current={last ? 'page' : undefined}
                title={typeof item.label === 'string' ? item.label : undefined}
                {...styleProps(
                  last ? styles.page : styles.ancestor,
                  dashboardBreadcrumbClasses(last ? 'page' : 'ancestor'),
                )}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <span
                aria-hidden
                {...styleProps(styles.separator, dashboardBreadcrumbClasses('separator'))}
              >
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
