'use client';

import { ChevronDown, Play } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';

import Tooltip from '@/base-ui/Tooltip';
import Icon from '@/Icon';
import ScrollShadow from '@/ScrollShadow';

import { useConsoleShellState } from '../ConsoleShell/context';
import { useLocalStorage, usePrefersReducedMotion } from '../hooks';
import { collectNavItems, findActiveBranch, resolveActiveHref } from './active';
import { styles } from './style';
import type { ConsoleNavGroup, ConsoleNavItem, ConsoleNavLinkProps, ConsoleNavProps } from './type';

const PANEL_TRANSITION_MS = 160;
const RAIL_TRANSITION_MS = 200;

type ExpandedOverrides = Record<string, boolean>;

/** Older builds stored the closed group keys as an array. */
function readOverrides(value: unknown): ExpandedOverrides {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((key) => [String(key), false]));
  }
  return value && typeof value === 'object' ? (value as ExpandedOverrides) : {};
}

function scrollActiveIntoView(container: HTMLElement, behavior: ScrollBehavior = 'auto') {
  const link =
    container.querySelector<HTMLElement>('[aria-current="page"]') ??
    [...container.querySelectorAll<HTMLElement>('button[data-active="true"]')].at(-1);
  if (!link) return;
  const containerRect = container.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  if (linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom) return;
  container.scrollBy({
    behavior,
    top: linkRect.top - containerRect.top - (containerRect.height - linkRect.height) / 2,
  });
}

interface LinkContext {
  onNavigate?: (href: string) => void;
  renderLink?: ConsoleNavProps['renderLink'];
}

function renderAnchor(context: LinkContext, linkProps: ConsoleNavLinkProps, onFollow: () => void) {
  if (context.renderLink) return context.renderLink(linkProps);
  return (
    <a
      aria-current={linkProps['aria-current']}
      aria-label={linkProps['aria-label']}
      className={linkProps.className}
      data-active={linkProps['data-active']}
      data-collapsed={linkProps['data-collapsed']}
      data-indent={linkProps['data-indent']}
      href={linkProps.href}
      rel={linkProps.external ? 'noreferrer' : undefined}
      target={linkProps.external ? '_blank' : undefined}
      title={linkProps.title}
      onClick={(event) => {
        if (context.onNavigate && !linkProps.external) event.preventDefault();
        onFollow();
      }}
    >
      {linkProps.children}
    </a>
  );
}

function NavLink({
  active,
  collapsed,
  context,
  href,
  icon,
  indent = 0,
  item,
  name,
  overlay = false,
}: {
  active: boolean;
  collapsed: boolean;
  context: LinkContext;
  href: string;
  icon?: ConsoleNavItem['icon'];
  indent?: number;
  item?: ConsoleNavItem;
  name: string;
  overlay?: boolean;
}) {
  const shell = useConsoleShellState();
  const label = item?.label ?? name;
  const follow = () => {
    context.onNavigate?.(href);
    shell?.closeNavigation();
  };
  const linkProps: ConsoleNavLinkProps = {
    'aria-current': active ? 'page' : undefined,
    'aria-label': collapsed ? name : undefined,
    'children': overlay ? null : (
      <>
        {icon ? <Icon icon={icon} size={18} /> : null}
        <span className={styles.itemLabel}>{label}</span>
        {item?.badge ? <span className={styles.badge}>{item.badge}</span> : null}
        {item?.badge ? <span aria-hidden className={styles.dot} /> : null}
      </>
    ),
    'className': overlay ? styles.railLink : styles.item,
    'data-active': active,
    'data-collapsed': collapsed,
    'data-indent': indent,
    'external': item?.external,
    href,
    'onClick': follow,
    'title': collapsed ? undefined : label,
  };

  const link = renderAnchor(context, linkProps, follow);

  if (!icon && !overlay) return link;
  // Always mounted so toggling the rail keeps the same link element and its label can fade.
  return (
    <Tooltip disabled={!collapsed} placement="right" title={name}>
      {link}
    </Tooltip>
  );
}

function Fold({ children, folded }: { children: ReactNode; folded: boolean }) {
  return (
    <div
      aria-hidden={folded || undefined}
      className={styles.fold}
      data-folded={folded}
      inert={folded || undefined}
    >
      <div>{children}</div>
    </div>
  );
}

function ConsoleNav({
  collapsed: collapsedProp,
  defaultExpanded = 'all',
  groups = [],
  items = [],
  label = 'Primary',
  onNavigate,
  pathname,
  renderLink,
  storageKey,
}: ConsoleNavProps) {
  const id = useId();
  const navRef = useRef<HTMLDivElement>(null);
  const shell = useConsoleShellState();
  const collapsed = collapsedProp ?? shell?.collapsed ?? false;
  const reducedMotion = usePrefersReducedMotion();
  const [storedOverrides, setStoredOverrides] = useLocalStorage<unknown>(storageKey, {});
  const overrides = readOverrides(storedOverrides);
  const context: LinkContext = { onNavigate, renderLink };

  const activeHref = resolveActiveHref(pathname, [...items, ...collectNavItems(groups)]);
  const activeBranch = findActiveBranch(pathname, groups, activeHref);

  // Arriving on a page reopens its branch even if it was closed by hand earlier.
  const [trackedPathname, setTrackedPathname] = useState(pathname);
  if (trackedPathname !== pathname) {
    setTrackedPathname(pathname);
    if (activeBranch.some((key) => overrides[key] === false)) {
      const next = { ...overrides };
      for (const key of activeBranch) delete next[key];
      setStoredOverrides(next);
    }
  }

  const isExpanded = (group: ConsoleNavGroup) =>
    overrides[group.key] ??
    (activeBranch.includes(group.key) || (group.defaultExpanded ?? defaultExpanded === 'all'));

  const toggleGroup = useCallback(
    (key: string, expanded: boolean) => {
      setStoredOverrides((current: unknown) => ({ ...readOverrides(current), [key]: !expanded }));
    },
    [setStoredOverrides],
  );

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    scrollActiveIntoView(container);
    if (reducedMotion) return;
    const timer = window.setTimeout(() => scrollActiveIntoView(container), PANEL_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [activeHref, pathname, reducedMotion]);

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const timer = window.setTimeout(
      () => scrollActiveIntoView(container, reducedMotion ? 'auto' : 'smooth'),
      reducedMotion ? 0 : RAIL_TRANSITION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [collapsed, reducedMotion]);

  // The rail folds rows out of this same tree instead of rendering its own, so icons stay put
  // while the sidebar width animates.
  const renderItems = (
    list: ConsoleNavItem[],
    indent: number,
    groupLabel: string | undefined,
    foldable: boolean,
  ) =>
    list.map((item) => {
      const link = (
        <NavLink
          active={item.href === activeHref}
          collapsed={collapsed}
          context={context}
          href={item.href}
          icon={item.icon}
          indent={item.icon ? Math.max(0, indent - 1) : indent}
          item={item}
          key={item.href}
          name={groupLabel ? `${groupLabel} / ${item.label}` : item.label}
        />
      );
      if (item.icon || !foldable) return link;
      return (
        <Fold folded={collapsed} key={item.href}>
          {link}
        </Fold>
      );
    });

  const renderGroup = (
    group: ConsoleNavGroup,
    level: number,
    indent: number,
    underRailIcon: boolean,
  ) => {
    const expanded = isExpanded(group);
    const panelId = `${id}-${group.key}`;
    // Nested groups are headings over their items, so the items keep the same indent.
    const childIndent = indent + (group.icon ? 1 : 0);
    const active = activeBranch.includes(group.key);
    const railIcon = level === 0 && Boolean(group.icon);
    const onRail = collapsed && !underRailIcon;
    const open = onRail ? !railIcon : expanded;
    const railHref = railIcon ? (group.href ?? collectNavItems([group])[0]?.href) : undefined;
    const railEmpty = !railIcon && !collectNavItems([group]).some((item) => item.icon);

    const header = (
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-hidden={(onRail && railIcon) || undefined}
        className={styles.groupHeader}
        data-active={active}
        data-icon={Boolean(group.icon)}
        data-indent={indent}
        data-level={level}
        tabIndex={onRail && railIcon ? -1 : undefined}
        type="button"
        onClick={() => toggleGroup(group.key, expanded)}
      >
        {group.icon ? <Icon icon={group.icon} size={16} /> : null}
        <span className={styles.itemLabel} data-label="">
          {group.label}
        </span>
        {level === 0 ? (
          <Icon className={styles.chevron} data-expanded={expanded} icon={ChevronDown} size={14} />
        ) : (
          <span className={styles.indicator} data-expanded={expanded}>
            <Play fill={'currentColor'} size={7} strokeWidth={1} />
          </span>
        )}
      </button>
    );

    let head: ReactNode = header;
    if (railIcon) {
      head = (
        <div className={styles.groupHead}>
          {header}
          {onRail && railHref ? (
            <NavLink
              collapsed
              overlay
              active={activeBranch[0] === group.key}
              context={context}
              href={railHref}
              name={group.label}
            />
          ) : null}
        </div>
      );
    } else if (!underRailIcon) {
      head = <Fold folded={onRail}>{header}</Fold>;
    }

    return (
      <div
        className={styles.group}
        data-icon={Boolean(group.icon)}
        data-level={level}
        data-rail-empty={railEmpty}
        key={group.key}
      >
        {head}
        <div
          aria-hidden={!open}
          className={styles.groupPanel}
          data-expanded={open}
          data-instant={reducedMotion}
          id={panelId}
          inert={open ? undefined : true}
        >
          <div className={styles.groupItems}>
            {renderItems(group.items ?? [], childIndent, group.label, !(underRailIcon || railIcon))}
            {(group.groups ?? []).map((child) =>
              renderGroup(child, level + 1, childIndent, underRailIcon || railIcon),
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ScrollShadow
      aria-label={label}
      as={'nav'}
      className={styles.nav}
      data-collapsed={collapsed}
      orientation={'vertical'}
      ref={navRef}
      size={4}
    >
      {items.length > 0 ? (
        <div
          className={styles.topItems}
          data-divided={groups.length > 0}
          data-rail-empty={!items.some((item) => item.icon)}
        >
          {renderItems(items, 0, undefined, true)}
        </div>
      ) : null}
      {groups.map((group) => renderGroup(group, 0, 0, false))}
    </ScrollShadow>
  );
}

ConsoleNav.displayName = 'ConsoleNav';

export default ConsoleNav;
