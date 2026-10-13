'use client';

import { createContext, type ReactNode, use } from 'react';

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
