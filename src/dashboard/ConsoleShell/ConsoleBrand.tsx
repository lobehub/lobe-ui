'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';

import { useConsoleShellState } from './context';
import { dashboardConsoleBrandClasses } from './stable';
import { styles } from './style';
import type { ConsoleBrandProps } from './type';

function ConsoleBrand({
  className,
  href = '/',
  label,
  logo,
  renderLink,
  title,
}: ConsoleBrandProps) {
  const shell = useConsoleShellState();
  const content =
    title == null || title === false || title === '' ? (
      logo
    ) : (
      <span {...styleProps(styles.brandLockup, dashboardConsoleBrandClasses('lockup'))}>
        {logo}
        <span {...styleProps(styles.brandName, dashboardConsoleBrandClasses('name'))}>{title}</span>
      </span>
    );
  const linkProps = {
    'aria-label': label ?? (typeof title === 'string' ? title : 'Home'),
    'children': content,
    'className':
      styleProps(styles.brandAnchor, clsx(dashboardConsoleBrandClasses(), className)).className ??
      '',
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
