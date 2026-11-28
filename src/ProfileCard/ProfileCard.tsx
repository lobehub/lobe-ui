'use client';

import clsx from 'clsx';
import { Building2, Globe, type LucideIcon, Mail, MapPin, Phone } from 'lucide-react';
import { memo } from 'react';

import cardsMessages from '@/i18n/resources/en/cards';
import { useTranslation } from '@/i18n/useTranslation';
import CoverImage from '@/internal/a2ui/CoverImage';
import { domainStyles } from '@/internal/a2ui/domain';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { initialsOf } from '@/internal/a2ui/utils';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { profileCardClasses } from './stable';
import { styles } from './style';
import type { ProfileCardProps } from './type';

/**
 * A person: avatar, name, role and company, location, bio, tags, stats and contact links. A plain
 * lobe-ui card (`default`) or the A2UI playground card (`a2ui`). Adapted from CopilotKit
 * a2ui-playground (MIT), `renderers/domain.tsx` ProfileCard.
 */
const ProfileCard = memo<ProfileCardProps>(
  ({
    avatar,
    bio,
    className,
    classNames,
    company,
    email,
    location,
    name,
    phone,
    ref,
    role,
    stats: statsProp,
    style,
    styles: customStyles,
    tags: tagsProp,
    texts,
    variant = 'default',
    website,
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(cardsMessages);
    const tags = (tagsProp ?? []).filter((tag) => typeof tag === 'string' && tag);
    const stats = (statsProp ?? []).filter((s) => s && s.label).slice(0, 4);
    const contacts = [
      email ? { href: `mailto:${email}`, icon: Mail, value: email } : null,
      phone ? { href: `tel:${phone.replaceAll(/[^+\d]/g, '')}`, icon: Phone, value: phone } : null,
      website
        ? {
            href: /^https?:/.test(website) ? website : `https://${website}`,
            icon: Globe,
            value: website.replace(/^https?:\/\//, ''),
          }
        : null,
    ].filter(Boolean) as { href: string; icon: LucideIcon; value: string }[];

    return (
      <div
        ref={ref}
        {...rest}
        {...styleProps(
          isA2ui
            ? [a2uiStyles.base, a2uiStyles.card, styles.root]
            : [domainStyles.dCard, styles.root],
          clsx(profileCardClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-variant={variant}
      >
        <div
          {...styleProps(
            [styles.banner, !isA2ui && styles.dBanner],
            clsx(profileCardClasses('banner'), classNames?.banner),
            customStyles?.banner,
          )}
        >
          {isA2ui ? <div {...styleProps(styles.bannerSheen)} /> : null}
        </div>
        <div
          {...styleProps(
            styles.body,
            clsx(profileCardClasses('body'), classNames?.body),
            customStyles?.body,
          )}
        >
          <div {...styleProps(styles.head)}>
            <span
              {...styleProps(
                [styles.avatar, !isA2ui && styles.dAvatar],
                profileCardClasses('avatar'),
              )}
            >
              {initialsOf(name)}
              <CoverImage alt={name} src={avatar} {...styleProps(styles.avatarImg)} />
            </span>
            {location ? (
              <span
                {...styleProps(
                  [styles.location, !isA2ui && styles.dMuted],
                  profileCardClasses('location'),
                )}
              >
                <MapPin aria-hidden size={12} style={{ flexShrink: 0 }} />
                <span {...styleProps(domainStyles.truncate)}>{location}</span>
              </span>
            ) : null}
          </div>
          <div {...styleProps(styles.nameBlock)}>
            <span
              {...styleProps([styles.name, !isA2ui && styles.dName], profileCardClasses('name'))}
            >
              {name}
            </span>
            {role || company ? (
              <span
                {...styleProps([styles.role, !isA2ui && styles.dRole], profileCardClasses('role'))}
              >
                {role ? <span {...styleProps(domainStyles.truncate)}>{role}</span> : null}
                {company ? (
                  <>
                    {role ? (
                      <span {...styleProps(styles.at)}>{texts?.at ?? t('profileCard.at')}</span>
                    ) : null}
                    <span {...styleProps(styles.company, profileCardClasses('company'))}>
                      <Building2 aria-hidden size={12} style={{ flexShrink: 0 }} />
                      <span {...styleProps(domainStyles.truncate)}>{company}</span>
                    </span>
                  </>
                ) : null}
              </span>
            ) : null}
          </div>
          {bio ? (
            <p {...styleProps([styles.bio, !isA2ui && styles.dBio], profileCardClasses('bio'))}>
              {bio}
            </p>
          ) : null}
          {tags.length > 0 ? (
            <div {...styleProps([domainStyles.chips, styles.tags], profileCardClasses('tags'))}>
              {tags.map((tag) =>
                isA2ui ? (
                  <span key={tag} {...styleProps(domainStyles.chip, profileCardClasses('tag'))}>
                    {tag}
                  </span>
                ) : (
                  <Tag className={profileCardClasses('tag')} key={tag}>
                    {tag}
                  </Tag>
                ),
              )}
            </div>
          ) : null}
          {stats.length > 0 ? (
            <div
              {...styleProps(
                [styles.stats, !isA2ui && styles.dStats],
                clsx(profileCardClasses('stats'), classNames?.stats),
                {
                  gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
                  ...customStyles?.stats,
                },
              )}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  {...styleProps(
                    [styles.stat, !isA2ui && styles.dStat],
                    profileCardClasses('stat'),
                  )}
                >
                  <span {...styleProps([styles.statValue, !isA2ui && styles.dStatValue])}>
                    {s.value}
                  </span>
                  <span {...styleProps([styles.statLabel, !isA2ui && styles.dStatLabel])}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          {contacts.length > 0 ? (
            <div
              {...styleProps(
                styles.contacts,
                clsx(profileCardClasses('contacts'), classNames?.contacts),
                customStyles?.contacts,
              )}
            >
              {contacts.map((c) => (
                <a
                  href={c.href}
                  key={c.href}
                  rel="noreferrer"
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  {...styleProps(
                    [styles.contact, !isA2ui && styles.dContact],
                    profileCardClasses('contact'),
                  )}
                >
                  <span {...styleProps([styles.contactIcon, !isA2ui && styles.dContactIcon])}>
                    <c.icon aria-hidden size={14} />
                  </span>
                  <span {...styleProps(domainStyles.truncate)}>{c.value}</span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
