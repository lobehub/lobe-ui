import type { HTMLAttributes, ReactNode } from 'react';

export type AuthLayoutBackground = 'plain' | 'grid';

export type AuthLayoutVariant = 'default' | 'elevated';

export interface AuthLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Message shown above the form, such as an error `Alert`. */
  alert?: ReactNode;
  /** Optional panel beside the form. Hidden below the laptop breakpoint. See `AuthLayout.Aside`. */
  aside?: ReactNode;
  /**
   * Page backdrop. `grid` draws a 32px line grid over a mix of the layout and elevated colors.
   * Any other node is rendered behind the content.
   * @default 'plain'
   */
  background?: AuthLayoutBackground | ReactNode;
  /** Home mark rendered in the corner. Pass your own logo. */
  brand?: ReactNode;
  /**
   * Render the sign-in card. Set `false` to keep only the header, tools and backdrop,
   * for status pages that center their own content.
   * @default true
   */
  card?: boolean;
  children?: ReactNode;
  description?: ReactNode;
  /** Small secondary line under the form, such as support links. */
  footer?: ReactNode;
  /** Replace the form with a skeleton. Title and description stay. */
  loading?: boolean;
  /** Mark shown above the title. */
  logo?: ReactNode;
  /** A string renders as the page heading. Other nodes render as is. */
  title?: ReactNode;
  /** Corner actions, such as a theme switch. */
  tools?: ReactNode;
  /**
   * Card shape. `elevated` uses a 28px radius for standalone sign-in pages.
   * @default 'default'
   */
  variant?: AuthLayoutVariant;
}

export interface AuthLayoutAsideProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Art behind the copy, such as `<Grainient />`. Defaults to a static gradient. */
  background?: ReactNode;
  /** Small line above the headline. */
  kicker?: ReactNode;
  /** Headline at the bottom of the panel. */
  line?: ReactNode;
}
