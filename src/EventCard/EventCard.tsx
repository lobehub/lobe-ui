'use client';

import clsx from 'clsx';
import { Clock, MapPin, Users } from 'lucide-react';
import { memo, useMemo } from 'react';

import Button from '@/Button';
import cardsMessages from '@/i18n/resources/en/cards';
import { useTranslation } from '@/i18n/useTranslation';
import A2uiButton from '@/internal/a2ui/A2uiButton';
import CoverImage from '@/internal/a2ui/CoverImage';
import { domainStyles } from '@/internal/a2ui/domain';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { eventCardClasses } from './stable';
import { dotStyles, styles } from './style';
import type { EventCardProps } from './type';

/** Parses "2026-11-14" as a local date, or anything `Date` reads; free text gives `null`. */
const parseDate = (input?: string): Date | null => {
  if (!input) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
};

const DOTS = [0, 1, 2] as const;

/**
 * An event: cover image, calendar date block, title, time, venue and host, description, tags,
 * attendee count and an RSVP action. A plain lobe-ui card (`default`) or the A2UI playground card
 * (`a2ui`). Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` EventCard.
 */
const EventCard = memo<EventCardProps>(
  ({
    actionLabel,
    attendees,
    className,
    classNames,
    date,
    description,
    host,
    image,
    locale = 'en-US',
    onAction,
    ref,
    style,
    styles: customStyles,
    tags: tagsProp,
    texts,
    time,
    title,
    variant = 'default',
    venue,
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(cardsMessages);
    const d = useMemo(() => parseDate(date), [date]);
    const tags = (tagsProp ?? []).filter((tag) => typeof tag === 'string' && tag);
    const hasAttendees = typeof attendees === 'number' && Number.isFinite(attendees);
    const timeLine = [!d ? date : null, time].filter(Boolean);
    const label = actionLabel ?? t('eventCard.rsvp');

    return (
      <div
        ref={ref}
        {...rest}
        {...styleProps(
          isA2ui
            ? [a2uiStyles.base, a2uiStyles.card, styles.root]
            : [domainStyles.dCard, styles.root],
          clsx(eventCardClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-variant={variant}
      >
        {image ? (
          <div
            {...styleProps(
              styles.cover,
              clsx(eventCardClasses('cover'), classNames?.cover),
              customStyles?.cover,
            )}
          >
            <CoverImage alt={typeof title === 'string' ? title : ''} src={image} />
            <div {...styleProps(styles.coverFade)} />
          </div>
        ) : null}
        <div
          {...styleProps(
            [styles.body, image ? styles.bodyWithCover : styles.bodyNoCover],
            clsx(eventCardClasses('body'), classNames?.body),
            customStyles?.body,
          )}
        >
          <div
            {...styleProps(
              [styles.date, !isA2ui && styles.dDate],
              clsx(eventCardClasses('date'), classNames?.date),
              customStyles?.date,
            )}
          >
            <span
              {...styleProps([styles.month, !isA2ui && styles.dMonth], eventCardClasses('month'))}
            >
              {d
                ? d.toLocaleDateString(locale, { month: 'short' })
                : (texts?.date ?? t('eventCard.date'))}
            </span>
            <span {...styleProps(styles.day, eventCardClasses('day'))}>
              {d ? d.getDate() : '?'}
            </span>
            <span {...styleProps(styles.weekday, eventCardClasses('weekday'))}>
              {d ? d.toLocaleDateString(locale, { weekday: 'short' }) : ''}
            </span>
          </div>
          <div {...styleProps([styles.main, !!image && styles.mainWithCover])}>
            <span
              {...styleProps([styles.title, !isA2ui && styles.dTitle], eventCardClasses('title'))}
            >
              {title}
            </span>
            <div {...styleProps([styles.meta, !isA2ui && styles.dMeta], eventCardClasses('meta'))}>
              {timeLine.length > 0 ? (
                <span {...styleProps(styles.metaRow, eventCardClasses('time'))}>
                  <Clock aria-hidden size={14} style={{ flexShrink: 0 }} />
                  {timeLine.map((part, i) => (
                    <span key={i}>
                      {i > 0 ? ', ' : null}
                      {part}
                    </span>
                  ))}
                </span>
              ) : null}
              {venue ? (
                <span {...styleProps(styles.metaRow, eventCardClasses('venue'))}>
                  <MapPin aria-hidden size={14} style={{ flexShrink: 0 }} />
                  <span {...styleProps(domainStyles.truncate)}>{venue}</span>
                </span>
              ) : null}
              {host ? (
                <span {...styleProps(styles.metaRow, eventCardClasses('host'))}>
                  <Users aria-hidden size={14} style={{ flexShrink: 0 }} />
                  <span {...styleProps(domainStyles.truncate)}>
                    {typeof host === 'string'
                      ? (texts?.hostedBy ?? t('eventCard.hostedBy')).replace('{host}', host)
                      : host}
                  </span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {description ? (
          <p
            {...styleProps(
              [styles.description, !isA2ui && styles.dDescription],
              eventCardClasses('description'),
            )}
          >
            {description}
          </p>
        ) : null}
        {tags.length > 0 ? (
          <div {...styleProps([domainStyles.chips, styles.tags], eventCardClasses('tags'))}>
            {tags.map((tag) =>
              isA2ui ? (
                <span key={tag} {...styleProps(domainStyles.chip, eventCardClasses('tag'))}>
                  {tag}
                </span>
              ) : (
                <Tag className={eventCardClasses('tag')} key={tag}>
                  {tag}
                </Tag>
              ),
            )}
          </div>
        ) : null}
        {hasAttendees || onAction ? (
          <div
            {...styleProps(
              [styles.footer, !isA2ui && styles.dFooter],
              clsx(eventCardClasses('footer'), classNames?.footer),
              customStyles?.footer,
            )}
          >
            {hasAttendees ? (
              <span
                {...styleProps(
                  [styles.attendees, !isA2ui && styles.dSmall],
                  eventCardClasses('attendees'),
                )}
              >
                <span aria-hidden {...styleProps(styles.dots)}>
                  {DOTS.map((i) => (
                    <span key={i} {...styleProps([styles.dot, dotStyles[i]])} />
                  ))}
                </span>
                {(texts?.going ?? t('eventCard.going')).replace(
                  '{count}',
                  attendees.toLocaleString(locale),
                )}
              </span>
            ) : (
              <span />
            )}
            {onAction ? (
              isA2ui ? (
                <A2uiButton
                  className={eventCardClasses('action')}
                  style={{ fontSize: 12.5, height: 32, paddingInline: 16 }}
                  tone="primary"
                  onClick={onAction}
                >
                  {label}
                </A2uiButton>
              ) : (
                <Button className={eventCardClasses('action')} type="primary" onClick={onAction}>
                  {label}
                </Button>
              )
            ) : null}
          </div>
        ) : null}
      </div>
    );
  },
);

EventCard.displayName = 'EventCard';

export default EventCard;
