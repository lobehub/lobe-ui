'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, type ReactNode, use } from 'react';

import { useThemeMode } from '@/styles/theme/scope';

import { styles } from './style';
import type { SurfaceLinkProps, SurfaceRenderLink } from './type';

const defaultRenderLink: SurfaceRenderLink = ({ children, ...rest }: SurfaceLinkProps) => (
  <a {...rest}>{children}</a>
);

const SurfaceLinkContext = createContext<SurfaceRenderLink>(defaultRenderLink);

const SurfaceDepthContext = createContext(0);

/** Plugs the app router into every dashboard card link (Surface, MetricStrip, Section). */
export const SurfaceLinkProvider = ({
  children,
  renderLink,
}: {
  children?: ReactNode;
  renderLink: SurfaceRenderLink;
}) => <SurfaceLinkContext value={renderLink}>{children}</SurfaceLinkContext>;

export const useSurfaceLink = (override?: SurfaceRenderLink) => override ?? use(SurfaceLinkContext);

/** How many Surface cards wrap this node. A table can skip its own card when already inside one. */
export const useSurfaceDepth = () => use(SurfaceDepthContext);

export { SurfaceDepthContext };

/**
 * StyleX styles for a dashboard card: `colorBgContainer` in light, translucent
 * `colorFillTertiary` in dark, and no fill of its own when nested in another Surface.
 */
export const useSurfaceCardStyles = () => {
  const { isDarkMode } = useThemeMode();
  const depth = useSurfaceDepth();
  return [styles.card, isDarkMode && styles.cardDark, depth > 0 && styles.cardNested] as const;
};

/** Class name form of `useSurfaceCardStyles`, for markup that is not styled with StyleX. */
export const useSurfaceCardClassName = () => stylex.props(useSurfaceCardStyles()).className ?? '';
