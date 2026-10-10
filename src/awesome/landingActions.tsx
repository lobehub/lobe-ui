import './landingActions.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Fragment, type ReactNode } from 'react';

import BottomGradientButton from '@/awesome/BottomGradientButton';
import { isExternalHref, type LandingLinkRender, renderLandingLink } from '@/awesome/landingLink';
import Icon, { type IconProps } from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { media } from '@/styles/stylex/media.stylex';
import { styleProps } from '@/styles/stylex/props';

export interface LandingAction {
  /** Opens in a new tab. Inferred from absolute URLs when omitted. */
  external?: boolean;
  href: string;
  icon?: IconProps['icon'];
  /** Places the icon after the label, e.g. for an arrow. */
  iconPlacement?: 'start' | 'end';
  label: ReactNode;
  /** The primary action is a filled pill; others render as BottomGradientButton. */
  primary?: boolean;
}

const styles = stylex.create({
  action: {
    gap: 8,
    borderColor: 'transparent',
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 0,
    paddingInline: 22,
    transition: 'filter 140ms ease, transform 90ms ease',
    alignItems: 'center',
    backgroundColor: cssVar.colorText,
    color: cssVar.colorBgContainer,
    display: 'inline-flex',
    filter: { 'default': null, ':hover': 'brightness(1.06)' },
    fontSize: cssVar.fontSize,
    fontWeight: 600,
    justifyContent: 'center',
    minBlockSize: 44,
    textDecoration: 'none',
    transform: { 'default': null, ':active': 'scale(0.97)' },
    whiteSpace: 'nowrap',
  },
  actionSmall: {
    gap: 6,
    paddingInline: 14,
    fontSize: cssVar.fontSizeSM,
    minBlockSize: 34,
  },
  group: {
    gap: 12,
    display: 'flex',
    flexWrap: 'wrap',
  },
  groupLarge: {
    alignSelf: { default: null, [media.mobile]: 'stretch' },
  },
  groupSmall: {
    gap: 8,
  },
});

export type LandingNavigate = (href: string) => void;

export interface LandingActionsProps {
  actions: LandingAction[];
  className?: string;
  /** Client-side navigation for internal non-primary actions, which render as buttons with an href. */
  onNavigate?: LandingNavigate;
  renderLink?: LandingLinkRender;
  size?: 'large' | 'small';
  xstyle?: Parameters<typeof styleProps>[0];
}

export const LandingActions = ({
  actions,
  className,
  onNavigate,
  renderLink,
  size = 'large',
  xstyle,
}: LandingActionsProps) => (
  <div
    {...styleProps(
      [styles.group, size === 'small' ? styles.groupSmall : styles.groupLarge, xstyle],
      clsx('lobe-landing-actions', className),
    )}
    data-size={size}
  >
    {actions.map(({ external, href, icon, iconPlacement = 'start', label, primary }) => {
      const iconNode = icon && <Icon icon={icon} size={size === 'small' ? 14 : 16} />;
      if (!primary) {
        const isExternal = external ?? isExternalHref(href);
        return (
          <BottomGradientButton
            href={href}
            icon={iconNode}
            iconPosition={iconPlacement}
            key={href}
            rel={isExternal ? 'noreferrer' : undefined}
            size={size === 'small' ? 'middle' : 'large'}
            target={isExternal ? '_blank' : undefined}
            onClick={
              !isExternal && onNavigate
                ? (event) => {
                    event.preventDefault();
                    onNavigate(href);
                  }
                : undefined
            }
          >
            {label}
          </BottomGradientButton>
        );
      }
      return (
        <Fragment key={href}>
          {renderLandingLink(renderLink, {
            children: (
              <>
                {iconPlacement === 'start' && iconNode}
                {label}
                {iconPlacement === 'end' && iconNode}
              </>
            ),
            className: stylex.props(styles.action, size === 'small' && styles.actionSmall)
              .className,
            external,
            href,
          })}
        </Fragment>
      );
    })}
  </div>
);
