'use client';

import { ChevronRight } from 'lucide-react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { useSurfaceLink } from '../Surface/link';
import Surface from '../Surface/Surface';
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
        className: styles.more,
        href: moreLink,
        rel: moreLink.startsWith('http') ? 'noreferrer' : undefined,
        target: moreLink.startsWith('http') ? '_blank' : undefined,
      })
    : null;
  const actions =
    extra || moreNode ? (
      <Flexbox horizontal align="center" gap={8}>
        {extra}
        {moreNode}
      </Flexbox>
    ) : undefined;

  if (variant === 'card') {
    return (
      <Surface
        description={desc}
        extra={actions}
        padded={padded ?? true}
        title={
          title ? (
            <span className={styles.title} style={fontSize ? { fontSize } : undefined}>
              {icon}
              {title}
            </span>
          ) : undefined
        }
      >
        <Flexbox className={className} gap={gap ?? 12} {...rest}>
          {children}
        </Flexbox>
      </Surface>
    );
  }

  if (!title) {
    return (
      <Flexbox className={className} gap={gap} {...rest}>
        {children}
      </Flexbox>
    );
  }

  return (
    <Flexbox className={className} gap={gap ?? 16} width="100%" {...rest}>
      <Flexbox horizontal align="center" gap={12} justify="space-between" width="100%">
        <Flexbox gap={4}>
          {icon}
          <h2 className={styles.title} style={fontSize ? { fontSize } : undefined}>
            {title}
          </h2>
          {desc ? <div className={styles.desc}>{desc}</div> : null}
        </Flexbox>
        {actions ?? null}
      </Flexbox>
      {children}
    </Flexbox>
  );
};

Section.displayName = 'Section';

export default Section;
