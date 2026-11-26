'use client';

import clsx from 'clsx';
import { MapPin } from 'lucide-react';
import { memo, useMemo } from 'react';

import agendaMessages from '@/i18n/resources/en/agenda';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles, a2uiToneFill } from '@/internal/a2ui/styles';
import { toA2uiTone } from '@/internal/a2ui/utils';
import { styleProps } from '@/styles/stylex/props';

import { agendaClasses } from './stable';
import { styles } from './style';
import type { AgendaProps } from './type';

const parseDate = (value: string) => {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

/**
 * Days with their timed events, in a lobe-ui card (`default`) or the A2UI playground card (`a2ui`). Adapted from CopilotKit
 * a2ui-playground (MIT), `renderers/data.tsx` Agenda.
 */
const Agenda = memo<AgendaProps>(
  ({
    className,
    classNames,
    days,
    locale: localeProp,
    ref,
    style,
    styles: customStyles,
    texts,
    title,
    variant = 'default',
  }) => {
    const isA2ui = variant === 'a2ui';
    const { locale: contextLocale, t } = useTranslation(agendaMessages);
    const locale = localeProp ?? contextLocale ?? 'en-US';
    const format = useMemo(
      () => ({
        month: new Intl.DateTimeFormat(locale, { month: 'short' }),
        weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      }),
      [locale],
    );
    const allDay = texts?.allDay ?? t('agenda.allDay');
    const empty = texts?.empty ?? t('agenda.empty');

    return (
      <div
        ref={ref}
        {...styleProps(
          isA2ui ? [a2uiStyles.base, a2uiStyles.card, styles.root] : [styles.root, styles.dCard],
          clsx(agendaClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-variant={variant}
      >
        {title ? (
          <div {...styleProps([styles.header, !isA2ui && styles.dHeader], agendaClasses('header'))}>
            <h3
              {...styleProps(
                [a2uiStyles.title, !isA2ui && styles.dTitle],
                clsx(agendaClasses('title'), classNames?.title),
                customStyles?.title,
              )}
            >
              {title}
            </h3>
          </div>
        ) : null}
        <div {...styleProps(styles.days, agendaClasses('days'))}>
          {days.map((day, dayIndex) => {
            const date = parseDate(day.date);
            const events = day.events ?? [];
            return (
              <div
                key={`${day.date}-${dayIndex}`}
                {...styleProps(
                  [styles.day, !isA2ui && styles.dDay],
                  clsx(agendaClasses('day'), classNames?.day),
                  customStyles?.day,
                )}
              >
                <div {...styleProps(styles.date, agendaClasses('date'))}>
                  <span
                    {...styleProps(
                      [a2uiStyles.label, styles.weekday, !isA2ui && styles.dWeekday],
                      agendaClasses('weekday'),
                    )}
                  >
                    {day.label ?? (date ? format.weekday.format(date) : null)}
                  </span>
                  <span
                    {...styleProps(
                      [styles.dayNumber, !isA2ui && styles.dDayNumber],
                      agendaClasses('day-number'),
                    )}
                  >
                    {date ? date.getDate() : day.date}
                  </span>
                  {date ? (
                    <span
                      {...styleProps(
                        [styles.month, !isA2ui && styles.dMonth],
                        agendaClasses('month'),
                      )}
                    >
                      {format.month.format(date)}
                    </span>
                  ) : null}
                </div>
                <div {...styleProps(styles.events, agendaClasses('events'))}>
                  {events.length === 0 ? (
                    <span
                      {...styleProps(
                        [styles.empty, !isA2ui && styles.dEmpty],
                        agendaClasses('empty'),
                      )}
                    >
                      {empty}
                    </span>
                  ) : null}
                  {events.map((event, eventIndex) => {
                    const tone = toA2uiTone(event.tone, 'accent');
                    return (
                      <div
                        data-tone={tone}
                        key={eventIndex}
                        {...styleProps(
                          isA2ui ? [a2uiStyles.well, styles.event] : [styles.event, styles.dEvent],
                          clsx(agendaClasses('event'), classNames?.event),
                          customStyles?.event,
                        )}
                      >
                        <span
                          aria-hidden
                          {...styleProps(
                            [styles.eventBar, a2uiToneFill[tone]],
                            agendaClasses('bar'),
                          )}
                        />
                        <span
                          {...styleProps(
                            [styles.time, !isA2ui && styles.dTime],
                            agendaClasses('time'),
                          )}
                        >
                          {event.time ?? allDay}
                        </span>
                        <div {...styleProps(styles.body, agendaClasses('body'))}>
                          <span
                            {...styleProps(
                              [styles.eventTitle, !isA2ui && styles.dEventTitle],
                              agendaClasses('event-title'),
                            )}
                          >
                            {event.title}
                          </span>
                          {event.speaker ? (
                            <span
                              {...styleProps(
                                [styles.meta, !isA2ui && styles.dMeta],
                                agendaClasses('speaker'),
                              )}
                            >
                              {event.speaker}
                            </span>
                          ) : null}
                          {event.description ? (
                            <span
                              {...styleProps(
                                [styles.description, !isA2ui && styles.dMeta],
                                agendaClasses('description'),
                              )}
                            >
                              {event.description}
                            </span>
                          ) : null}
                          {event.location ? (
                            <span
                              {...styleProps(
                                [styles.location, !isA2ui && styles.dMeta],
                                agendaClasses('location'),
                              )}
                            >
                              <MapPin aria-hidden size={12} style={{ flexShrink: 0 }} />
                              <span {...styleProps(styles.truncate)}>{event.location}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

Agenda.displayName = 'Agenda';

export default Agenda;
