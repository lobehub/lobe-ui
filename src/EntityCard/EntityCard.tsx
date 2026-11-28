'use client';

import clsx from 'clsx';
import { isValidElement, type KeyboardEvent, memo, type MouseEvent, type ReactNode } from 'react';

import Button from '@/Button';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';
import { toDataAttributes } from '@/utils/bem';

import { entityCardClasses } from './stable';
import { badgeTones, styles } from './style';
import type {
  EntityCardAction,
  EntityCardBadge,
  EntityCardBadgeColor,
  EntityCardProps,
} from './type';

const isBadgeConfig = (value: unknown): value is EntityCardBadge =>
  !!value &&
  typeof value === 'object' &&
  !isValidElement(value) &&
  !Array.isArray(value) &&
  'label' in value;

const TAG_COLOR: Record<EntityCardBadgeColor, string | undefined> = {
  danger: 'error',
  default: undefined,
  discovery: 'purple',
  info: 'info',
  secondary: undefined,
  success: 'success',
  warning: 'warning',
};

const BUTTON_TYPE = {
  ghost: 'text',
  outline: 'default',
  soft: 'fill',
  solid: 'primary',
} as const;

const a2uiButtonStyles = {
  ghost: styles.buttonGhost,
  outline: styles.buttonOutline,
  soft: styles.buttonSoft,
  solid: styles.buttonSolid,
};

const openUrl = (href: string) => {
  if (typeof window !== 'undefined') window.open(href, '_blank', 'noopener,noreferrer');
};

const STAR_PATH =
  'M12 2.2l2.86 6.6 7.14.62-5.42 4.72 1.62 7.02L12 17.4l-6.2 3.76 1.62-7.02L2 9.42l7.14-.62z';

/**
 * The card's five stars: filled ones rounded to the nearest whole star. Drawn as SVG at the advance
 * of the official text stars (`★`), so they look the same whatever symbol font the system has.
 */
const Stars = ({ value }: { value: number }) => {
  const filled = Math.round(value);
  return (
    <span aria-hidden {...styleProps(styles.stars, entityCardClasses('stars'))}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          data-filled={index < filled || undefined}
          key={index}
          viewBox="0 0 24 24"
          {...styleProps([styles.star, index < filled ? styles.starFill : styles.starEmpty])}
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
};

/**
 * One product, place, person or listing: image, subtitle and badge, title, rating, description,
 * a meta line and up to three actions. A lobe-ui card by default; `variant="a2ui"` is the A2UI
 * playground card. Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT),
 * `standard/composites.tsx` EntityCard.
 */
const EntityCard = memo<EntityCardProps>(
  ({
    actions,
    badge,
    className,
    classNames,
    description,
    href,
    image,
    imageAlt,
    imageAspectRatio = '4 / 3',
    layout = 'vertical',
    meta,
    onAction,
    onClick,
    rating,
    ratingCount,
    ref,
    style,
    styles: customStyles,
    subtitle,
    title,
    variant = 'default',
    width,
  }) => {
    const isA2ui = variant === 'a2ui';
    const horizontal = layout === 'horizontal';
    const clickable = !!href || !!onClick;
    const shownActions = (actions ?? []).slice(0, 3);

    const activate = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      if (onClick) onClick(event as MouseEvent<HTMLElement>);
      else if (href) openUrl(href);
    };

    const runAction = (action: EntityCardAction, index: number, event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      if (action.onClick) action.onClick(event);
      else if (action.href) openUrl(action.href);
      else onAction?.(action, index);
    };

    const badgeNode: ReactNode = (() => {
      if (badge == null || badge === false) return null;
      if (!isBadgeConfig(badge)) return badge;
      const color = badge.color ?? 'default';
      if (isA2ui)
        return (
          <span
            data-tone={color}
            {...styleProps([styles.a2uiBadge, badgeTones[color]], entityCardClasses('badge'))}
          >
            {badge.label}
          </span>
        );
      return (
        <Tag className={entityCardClasses('badge')} color={TAG_COLOR[color]} size="small">
          {badge.label}
        </Tag>
      );
    })();

    const clampedRating = rating === undefined ? undefined : Math.max(0, Math.min(5, rating));

    const imageNode =
      image == null ? null : typeof image === 'string' ? (
        <img
          alt={imageAlt ?? (typeof title === 'string' ? title : '')}
          loading="lazy"
          src={image}
          {...styleProps(
            [styles.image, horizontal && styles.imageHorizontal],
            clsx(entityCardClasses('image'), classNames?.image),
            {
              ...(horizontal ? undefined : { aspectRatio: imageAspectRatio }),
              ...customStyles?.image,
            },
          )}
        />
      ) : (
        <div
          {...styleProps(
            [styles.imageSlot, horizontal && styles.imageHorizontal],
            clsx(entityCardClasses('image'), classNames?.image),
            {
              ...(horizontal ? undefined : { aspectRatio: imageAspectRatio }),
              ...customStyles?.image,
            },
          )}
        >
          {image}
        </div>
      );

    return (
      <div
        ref={ref}
        role={clickable ? 'link' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? activate : undefined}
        onKeyDown={
          clickable
            ? (event) => {
                if (event.target !== event.currentTarget) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  activate(event);
                }
              }
            : undefined
        }
        {...toDataAttributes({ clickable, layout, variant })}
        {...styleProps(
          [
            isA2ui
              ? [a2uiStyles.base, styles.a2uiCard]
              : [styles.dCard, clickable && styles.dClickable],
            styles.root,
            horizontal && styles.horizontal,
            clickable && styles.clickable,
          ],
          clsx(entityCardClasses(), className, classNames?.root),
          { width: width ?? '100%', ...style, ...customStyles?.root },
        )}
      >
        {imageNode}
        <div
          {...styleProps(
            [styles.body, isA2ui ? styles.a2uiBody : styles.dBody],
            clsx(entityCardClasses('body'), classNames?.body),
            customStyles?.body,
          )}
        >
          {(subtitle != null || badgeNode != null) && (
            <div {...styleProps(styles.head, entityCardClasses('head'))}>
              {subtitle != null && (
                <span
                  {...styleProps(
                    [styles.subtitle, isA2ui ? styles.a2uiSubtitle : styles.dSubtitle],
                    entityCardClasses('subtitle'),
                  )}
                >
                  {subtitle}
                </span>
              )}
              {badgeNode}
            </div>
          )}
          <span
            {...styleProps(
              isA2ui ? styles.a2uiTitle : styles.dTitle,
              clsx(entityCardClasses('title'), classNames?.title),
              customStyles?.title,
            )}
          >
            {title}
          </span>
          {clampedRating !== undefined && (
            <span
              aria-label={`${clampedRating} out of 5`}
              role="img"
              {...styleProps(
                [styles.rating, isA2ui ? styles.a2uiRating : styles.dRating],
                entityCardClasses('rating'),
              )}
            >
              <Stars value={clampedRating} />
              <span>{clampedRating.toFixed(1)}</span>
              {ratingCount !== undefined && <span>({ratingCount})</span>}
            </span>
          )}
          {description != null && (
            <span
              {...styleProps(
                [styles.clamp3, isA2ui ? styles.a2uiDescription : styles.dDescription],
                entityCardClasses('description'),
              )}
            >
              {description}
            </span>
          )}
          {meta != null && (
            <span
              {...styleProps(isA2ui ? styles.a2uiMeta : styles.dMeta, entityCardClasses('meta'))}
            >
              {meta}
            </span>
          )}
          {shownActions.length > 0 && (
            <div
              {...styleProps(
                styles.actions,
                clsx(entityCardClasses('actions'), classNames?.actions),
                customStyles?.actions,
              )}
            >
              {shownActions.map((action, index) => {
                const kind = action.variant ?? (action.href || onAction ? 'outline' : 'ghost');
                const key = action.key ?? index;
                if (isA2ui)
                  return (
                    <button
                      key={key}
                      type="button"
                      {...styleProps(
                        [styles.button, a2uiButtonStyles[kind]],
                        entityCardClasses('action'),
                      )}
                      onClick={(event) => runAction(action, index, event)}
                    >
                      {action.label}
                    </button>
                  );
                return (
                  <Button
                    className={entityCardClasses('action')}
                    key={key}
                    size="small"
                    type={BUTTON_TYPE[kind]}
                    onClick={(event: MouseEvent<HTMLElement>) => runAction(action, index, event)}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },
);

EntityCard.displayName = 'EntityCard';

export default EntityCard;
