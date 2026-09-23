import type { ReactNode } from 'react';

import type { LandingAction, LandingNavigate } from '@/awesome/landingActions';
import type { LandingLinkRender } from '@/awesome/landingLink';
import type { DivProps } from '@/types';

export type LandingHeroAction = LandingAction;

export interface LandingHeroProps extends Omit<DivProps, 'title'> {
  /** Rendered after the title with the landing accent gradient. */
  accent?: ReactNode;
  actions?: LandingHeroAction[];
  /**
   * Content beside the text, e.g. an AgentSkillCard or a product preview. Setting it switches the
   * hero to a two-column layout with left-aligned text; it stacks below the text on narrow screens.
   */
  aside?: ReactNode;
  /**
   * Background layer. Pass `false` to render none.
   * @default <FluidGradient />
   */
  background?: ReactNode | false;
  /** Small pill above the title, e.g. a release note link. */
  badge?: ReactNode;
  /** Full-width content below the hero, e.g. a LogoMarquee. */
  children?: ReactNode;
  description?: ReactNode;
  /** Renders action links, so client-side routers can supply their own Link. */
  /** Client-side navigation for internal non-primary actions (rendered as BottomGradientButton). */
  onNavigate?: LandingNavigate;
  renderLink?: LandingLinkRender;
  title: ReactNode;
}
