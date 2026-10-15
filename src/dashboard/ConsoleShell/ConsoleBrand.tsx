'use client';

import * as stylex from '@stylexjs/stylex';

import { useConsoleShellState } from './context';
import { styles } from './style';
import type { ConsoleBrandProps } from './type';

function ConsoleBrand({ href = '/', label, logo, renderLink, title }: ConsoleBrandProps) {
  const shell = useConsoleShellState();
  const content =
    title == null || title === false || title === '' ? (
      logo
    ) : (
      <span {...stylex.props(styles.brandLockup)}>
        {logo}
        <span {...stylex.props(styles.brandName)}>{title}</span>
      </span>
    );
  const linkProps = {
    'aria-label': label ?? (typeof title === 'string' ? title : 'Home'),
    'children': content,
    'className': stylex.props(styles.brandAnchor).className ?? '',
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
