import type { ReactNode } from 'react';

import type { LandingAction, LandingNavigate } from '@/awesome/landingActions';
import type { LandingLinkRender } from '@/awesome/landingLink';
import type { DivProps } from '@/types';

export interface LandingSectionProps extends Omit<DivProps, 'title'> {
  /** Small buttons on the right side of the header, e.g. "Browse components". */
  actions?: LandingAction[];
  /**
   * `start` puts the heading on the left and `actions`/`extra` on the right; `center` stacks
   * everything centered.
   * @default 'start'
   */
  align?: 'center' | 'start';
  children?: ReactNode;
  description?: ReactNode;
  /**
   * Draws a hairline above the section to separate it from the previous one.
   * @default true
   */
  divider?: boolean;
  /** Custom content on the right side of the header, after `actions`. */
  extra?: ReactNode;
  /** Small tag above the title, e.g. "Components". */
  eyebrow?: ReactNode;
  /**
   * Tag color: a preset such as `purple`, `blue`, `cyan`, `green`, `orange` or `magenta`, or any CSS color.
   * @default 'blue'
   */
  eyebrowColor?: string;
  /** Used for the heading id so the section is labelled for assistive technology. */
  id?: string;
  /** Client-side navigation for internal non-primary actions (rendered as BottomGradientButton). */
  onNavigate?: LandingNavigate;
  renderLink?: LandingLinkRender;
  title?: ReactNode;
}
