'use client';

import clsx from 'clsx';
import { Droplets, type LucideIcon, MapPin, Thermometer, Wind } from 'lucide-react';
import { memo } from 'react';

import cardsMessages from '@/i18n/resources/en/cards';
import { useTranslation } from '@/i18n/useTranslation';
import { domainStyles } from '@/internal/a2ui/domain';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';

import { weatherCardClasses } from './stable';
import { glowStyles, styles, tintStyles } from './style';
import type { WeatherCardProps, WeatherIconKey } from './type';
import { isNum, weatherIcons, weatherKey } from './weather';

const WeatherIcon = ({
  icon,
  size,
  hero,
}: {
  hero?: boolean;
  icon: WeatherIconKey;
  size: number;
}) => {
  const Icon = weatherIcons[icon];
  return (
    <Icon
      aria-hidden
      size={size}
      strokeWidth={1.75}
      {...styleProps([tintStyles[icon], hero && styles.heroIcon], weatherCardClasses('icon'))}
    />
  );
};

/**
 * Current weather with a condition icon, temperature, high / low, details, an hourly strip and a
 * daily forecast. Renders the props it is given; it fetches nothing. A plain lobe-ui card
 * (`default`) or the A2UI playground card (`a2ui`). Adapted from CopilotKit a2ui-playground
 * (MIT), `renderers/domain.tsx` WeatherCard.
 */
const WeatherCard = memo<WeatherCardProps>(
  ({
    className,
    classNames,
    condition,
    daily: dailyProp,
    feels,
    high,
    hourly: hourlyProp,
    humidity,
    icon,
    location,
    low,
    ref,
    style,
    styles: customStyles,
    temp,
    texts,
    unit = 'C',
    variant = 'default',
    wind,
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(cardsMessages);
    const key = weatherKey(icon, condition);
    const hourly = (hourlyProp ?? []).filter((h) => h && isNum(h.temp));
    const daily = (dailyProp ?? []).filter((d) => d && isNum(d.min) && isNum(d.max));
    const lo = daily.length > 0 ? Math.min(...daily.map((d) => d.min)) : 0;
    const hi = daily.length > 0 ? Math.max(...daily.map((d) => d.max)) : 1;
    const span = Math.max(hi - lo, 1);
    const details = [
      isNum(feels)
        ? {
            icon: Thermometer,
            label: texts?.feelsLike ?? t('weatherCard.feelsLike'),
            value: `${Math.round(feels)}°`,
          }
        : null,
      isNum(humidity)
        ? {
            icon: Droplets,
            label: texts?.humidity ?? t('weatherCard.humidity'),
            value: `${Math.round(humidity)}%`,
          }
        : null,
      isNum(wind)
        ? {
            icon: Wind,
            label: texts?.wind ?? t('weatherCard.wind'),
            value: `${Math.round(wind)} ${unit === 'F' ? 'mph' : 'km/h'}`,
          }
        : null,
    ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];
    const highText = isNum(high)
      ? `${texts?.high ?? t('weatherCard.high')} ${Math.round(high)}°`
      : '';
    const lowText = isNum(low) ? `${texts?.low ?? t('weatherCard.low')} ${Math.round(low)}°` : '';

    return (
      <div
        ref={ref}
        {...rest}
        {...styleProps(
          isA2ui
            ? [a2uiStyles.base, a2uiStyles.card, styles.root]
            : [domainStyles.dCard, styles.root],
          clsx(weatherCardClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-condition={key}
        data-variant={variant}
      >
        {isA2ui ? (
          <div
            aria-hidden
            {...styleProps([styles.glow, glowStyles[key]], weatherCardClasses('glow'))}
          />
        ) : null}
        <div
          {...styleProps(
            styles.hero,
            clsx(weatherCardClasses('hero'), classNames?.hero),
            customStyles?.hero,
          )}
        >
          <div {...styleProps(styles.heroText)}>
            {location ? (
              <span
                {...styleProps(
                  [styles.location, !isA2ui && styles.dLocation],
                  weatherCardClasses('location'),
                )}
              >
                <MapPin aria-hidden size={isA2ui ? 12 : 14} style={{ flexShrink: 0 }} />
                <span {...styleProps(domainStyles.truncate)}>{location}</span>
              </span>
            ) : null}
            <div {...styleProps(styles.tempRow)}>
              <span
                {...styleProps([styles.temp, !isA2ui && styles.dTemp], weatherCardClasses('temp'))}
              >
                {isNum(temp) ? Math.round(temp) : '--'}
              </span>
              <span
                {...styleProps([styles.unit, !isA2ui && styles.dMuted], weatherCardClasses('unit'))}
              >
                °{unit}
              </span>
            </div>
            {condition ? (
              <span
                {...styleProps(
                  [styles.conditionText, !isA2ui && styles.dCondition],
                  weatherCardClasses('condition'),
                )}
              >
                {condition}
              </span>
            ) : null}
            {highText || lowText ? (
              <span
                {...styleProps(
                  [styles.range, !isA2ui && styles.dMuted, !isA2ui && styles.dSmall],
                  weatherCardClasses('range'),
                )}
              >
                {[highText, lowText].filter(Boolean).join(' · ')}
              </span>
            ) : null}
          </div>
          <WeatherIcon hero={isA2ui} icon={key} size={72} />
        </div>

        {details.length > 0 ? (
          <div
            {...styleProps(
              styles.details,
              clsx(weatherCardClasses('details'), classNames?.details),
              customStyles?.details,
            )}
          >
            {details.map((d) => (
              <div
                key={d.label}
                {...styleProps(
                  isA2ui ? [a2uiStyles.well, styles.detail] : [styles.detail, styles.dDetail],
                  weatherCardClasses('detail'),
                )}
              >
                <d.icon aria-hidden size={14} {...styleProps(styles.detailIcon)} />
                <span {...styleProps(styles.detailText)}>
                  <span {...styleProps([styles.detailLabel, !isA2ui && styles.dDetailLabel])}>
                    {d.label}
                  </span>
                  <span {...styleProps([styles.detailValue, !isA2ui && styles.dDetailValue])}>
                    {d.value}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {hourly.length > 0 ? (
          <div
            {...styleProps(
              [styles.hourly, !isA2ui && styles.dLine],
              clsx(weatherCardClasses('hourly'), classNames?.hourly),
              customStyles?.hourly,
            )}
          >
            <div {...styleProps(styles.hours)}>
              {hourly.map((h, i) => (
                <div
                  key={`${h.label}-${i}`}
                  {...styleProps(
                    [
                      styles.hour,
                      i === 0 && styles.hourCurrent,
                      i === 0 && !isA2ui && styles.dHourCurrent,
                    ],
                    weatherCardClasses('hour'),
                  )}
                >
                  <span
                    {...styleProps([
                      styles.hourLabel,
                      !isA2ui && styles.dMuted,
                      !isA2ui && styles.dSmall,
                      i === 0 && styles.hourLabelCurrent,
                    ])}
                  >
                    {h.label}
                  </span>
                  <WeatherIcon icon={weatherKey(h.icon)} size={18} />
                  <span {...styleProps([styles.hourTemp, !isA2ui && styles.dDetailValue])}>
                    {Math.round(h.temp)}°
                  </span>
                  <span
                    {...styleProps([
                      styles.hourPrecip,
                      !(isNum(h.precip) && h.precip > 0) && styles.hourPrecipHidden,
                    ])}
                  >
                    {Math.round(h.precip ?? 0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {daily.length > 0 ? (
          <div
            {...styleProps(
              [styles.daily, !isA2ui && styles.dLine],
              clsx(weatherCardClasses('daily'), classNames?.daily),
              customStyles?.daily,
            )}
          >
            {daily.map((d, i) => {
              const left = ((d.min - lo) / span) * 100;
              const width = Math.max(((d.max - d.min) / span) * 100, 4);
              return (
                <div key={`${d.label}-${i}`} {...styleProps(styles.day, weatherCardClasses('day'))}>
                  <span {...styleProps([styles.dayLabel, !isA2ui && styles.dDayLabel])}>
                    {d.label}
                  </span>
                  <WeatherIcon icon={weatherKey(d.icon)} size={16} />
                  <span {...styleProps(styles.dayPrecip)}>
                    {isNum(d.precip) && d.precip > 0 ? `${Math.round(d.precip)}%` : ''}
                  </span>
                  <span {...styleProps([styles.dayMin, !isA2ui && styles.dMuted])}>
                    {Math.round(d.min)}°
                  </span>
                  <span
                    {...styleProps([styles.bar, !isA2ui && styles.dBar], weatherCardClasses('bar'))}
                  >
                    <span
                      {...styleProps(styles.barFill, undefined, {
                        insetInlineStart: `${left}%`,
                        width: `${width}%`,
                      })}
                    />
                  </span>
                  <span {...styleProps(styles.dayMax)}>{Math.round(d.max)}°</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  },
);

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;
