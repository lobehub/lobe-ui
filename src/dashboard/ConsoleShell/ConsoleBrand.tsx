'use client';

import { useConsoleShellState } from './context';
import { styles } from './style';
import type { ConsoleBrandProps } from './type';

function ConsoleBrand({ href = '/', label, logo, renderLink, title }: ConsoleBrandProps) {
  const shell = useConsoleShellState();
  const collapsed = shell?.collapsed ?? false;
  const lockup =
    title == null || title === false || title === '' ? (
      logo
    ) : (
      <span className={styles.brandLockup}>
        {logo}
        <span className={styles.brandName}>{title}</span>
      </span>
    );
  const content = collapsed ? logo : lockup;
  const linkProps = {
    'aria-label': label ?? (typeof title === 'string' ? title : 'Home'),
    'children': content,
    'className': styles.brandAnchor,
    href,
    'onClick': () => shell?.closeNavigation(),
  };
  if (renderLink) return renderLink(linkProps);
  return (
    <a
      aria-label={linkProps['aria-label']}
      className={linkProps.className}
      href={href}
      onClick={linkProps.onClick}
    >
      {content}
    </a>
  );
}

ConsoleBrand.displayName = 'ConsoleBrand';

export default ConsoleBrand;
