import { createStaticStyles, cx } from 'antd-style';
import { Fragment, type ReactNode } from 'react';

import BottomGradientButton from '@/awesome/BottomGradientButton';
import { isExternalHref, type LandingLinkRender, renderLandingLink } from '@/awesome/landingLink';
import { accentGradient } from '@/awesome/landingTokens';
import Icon, { type IconProps } from '@/Icon';

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

const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  action: css`
    display: inline-flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    min-block-size: 44px;
    padding-block: 0;
    padding-inline: 22px;
    border: 1px solid transparent;
    border-radius: 999px;

    font-size: ${cssVar.fontSize};
    font-weight: 600;
    color: ${cssVar.colorText};
    text-decoration: none;
    white-space: nowrap;

    background-image:
      linear-gradient(${cssVar.colorBgContainer}, ${cssVar.colorBgContainer}), ${accentGradient};
    background-clip: padding-box, border-box;
    background-origin: border-box;

    transition:
      filter 140ms ease,
      transform 90ms ease;

    &:hover {
      color: ${cssVar.colorText};
      filter: brightness(1.06);
    }

    &:active {
      transform: scale(0.97);
    }
  `,
  actionPrimary: css`
    && {
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }

    &&:hover {
      color: ${cssVar.colorBgContainer};
    }
  `,
  actionSmall: css`
    && {
      gap: 6px;
      min-block-size: 34px;
      padding-inline: 14px;
      font-size: ${cssVar.fontSizeSM};
    }
  `,
  group: css`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    &[data-size='small'] {
      gap: 8px;
    }

    ${responsive.mobile} {
      &[data-size='large'] {
        align-self: stretch;
      }

      &[data-size='large'] > * {
        flex: 1;
      }
    }
  `,
}));

export type LandingNavigate = (href: string) => void;

export interface LandingActionsProps {
  actions: LandingAction[];
  className?: string;
  /** Client-side navigation for internal non-primary actions, which render as buttons with an href. */
  onNavigate?: LandingNavigate;
  renderLink?: LandingLinkRender;
  size?: 'large' | 'small';
}

export const LandingActions = ({
  actions,
  className,
  onNavigate,
  renderLink,
  size = 'large',
}: LandingActionsProps) => (
  <div className={cx(styles.group, className)} data-size={size}>
    {actions.map(({ external, href, icon, iconPlacement = 'start', label, primary }) => {
      const iconNode = icon && <Icon icon={icon} size={size === 'small' ? 14 : 16} />;
      if (!primary) {
        const isExternal = external ?? isExternalHref(href);
        return (
          <BottomGradientButton
            href={href}
            icon={iconNode}
            iconPlacement={iconPlacement}
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
            className: cx(
              styles.action,
              styles.actionPrimary,
              size === 'small' && styles.actionSmall,
            ),
            external,
            href,
          })}
        </Fragment>
      );
    })}
  </div>
);
