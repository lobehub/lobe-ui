import type { HTMLAttributes, ReactNode } from 'react';

export interface SurfaceLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
  rel?: string;
  target?: string;
}

/** Renders a link with the app's router. Defaults to a plain `<a>`. */
export type SurfaceRenderLink = (props: SurfaceLinkProps) => ReactNode;

export interface SurfaceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Drop body padding and widen table cells so a table sits on the card edges. */
  bleed?: boolean;
  /** Full-width slot under the body, for a chart that meets the card edges. */
  chart?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  /** Makes the heading a link to the page this card summarises. */
  href?: string;
  /**
   * First load: with no children the body is a placeholder block.
   * A refresh with children keeps them and shows a small spinner in the header.
   */
  loading?: boolean;
  /** Pad the body. Defaults to on for a card with a header and off for a bare card. */
  padded?: boolean;
  /** Overrides the link renderer from `SurfaceLinkProvider`. */
  renderLink?: SurfaceRenderLink;
  /** Visible heading. */
  title?: ReactNode;
}
