import type { LandingLinkRender } from '@lobehub/ui/awesome';
import { Link } from 'react-router';

export const renderLink: LandingLinkRender = ({ external, href, ...props }) =>
  external ? (
    <a href={href} rel="noreferrer" target="_blank" {...props} />
  ) : (
    <Link to={href} {...props} />
  );
