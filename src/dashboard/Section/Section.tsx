'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useSurfaceLink } from '../Surface/link';
import Surface from '../Surface/Surface';
import { dashboardSectionClasses } from './stable';
import { styles } from './style';
import type { SectionProps } from './type';

/** A titled page section with description, extra and a "more" link, flat or as a card. */
const Section = ({
  className,
  variant = 'default',
  fontSize,
  title,
  more,
  moreLink,
  icon,
  children,
  desc,
  extra,
  gap,
  padded,
  renderLink,
  ...rest
}: SectionProps) => {
  const link = useSurfaceLink(renderLink);
  const moreNode = moreLink
    ? link({
        children: (
          <>
            <span>{more}</span>
            <Icon icon={ChevronRight} />
          </>
        ),
        className: styleProps(styles.more, dashboardSectionClasses('more')).className,
        href: moreLink,
        rel: moreLink.startsWith('http') ? 'noreferrer' : undefined,
        target: moreLink.startsWith('http') ? '_blank' : undefined,
      })
    : null;
  const actions =
    extra || moreNode ? (
      <Flexbox horizontal align="center" className={dashboardSectionClasses('actions')} gap={8}>
        {extra}
        {moreNode}
      </Flexbox>
    ) : undefined;

  if (variant === 'card') {
    return (
      <Surface
        className={dashboardSectionClasses()}
        description={desc}
        extra={actions}
        padded={padded ?? true}
        {...toDataAttributes({ variant })}
        title={
          title ? (
            <span
              {...styleProps(
                styles.title,
                dashboardSectionClasses('title'),
                fontSize ? { fontSize } : undefined,
              )}
            >
              {icon}
              {title}
            </span>
          ) : undefined
        }
      >
        <Flexbox
          className={clsx(dashboardSectionClasses('body'), className)}
          gap={gap ?? 12}
          {...rest}
        >
          {children}
        </Flexbox>
      </Surface>
    );
  }

  if (!title) {
    return (
      <Flexbox
        className={clsx(dashboardSectionClasses(), className)}
        gap={gap}
        {...toDataAttributes({ variant })}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  }

  return (
    <Flexbox
      className={clsx(dashboardSectionClasses(), className)}
      gap={gap ?? 16}
      width="100%"
      {...toDataAttributes({ variant })}
      {...rest}
    >
      <Flexbox
        horizontal
        align="center"
        className={dashboardSectionClasses('header')}
        gap={12}
        justify="space-between"
        width="100%"
      >
        <Flexbox className={dashboardSectionClasses('heading')} gap={4}>
          {icon}
          <h2
            {...styleProps(
              styles.title,
              dashboardSectionClasses('title'),
              fontSize ? { fontSize } : undefined,
            )}
          >
            {title}
          </h2>
          {desc ? (
            <div {...styleProps(styles.desc, dashboardSectionClasses('desc'))}>{desc}</div>
          ) : null}
        </Flexbox>
        {actions ?? null}
      </Flexbox>
      {children}
    </Flexbox>
  );
};

Section.displayName = 'Section';

export default Section;
