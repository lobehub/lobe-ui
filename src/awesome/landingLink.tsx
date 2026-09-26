import type { ReactNode } from 'react';

export interface LandingLinkProps {
  children: ReactNode;
  className?: string;
  external?: boolean;
  href: string;
}

export type LandingLinkRender = (props: LandingLinkProps) => ReactNode;

export const isExternalHref = (href: string) => /^[a-z][\d+.a-z-]*:/i.test(href);

export const renderLandingLink = (
  renderLink: LandingLinkRender | undefined,
  { external, href, ...props }: LandingLinkProps,
): ReactNode => {
  const isExternal = external ?? isExternalHref(href);
  if (renderLink) return renderLink({ ...props, external: isExternal, href });

  return (
    <a href={href} {...(isExternal ? { rel: 'noreferrer', target: '_blank' } : {})} {...props} />
  );
};
