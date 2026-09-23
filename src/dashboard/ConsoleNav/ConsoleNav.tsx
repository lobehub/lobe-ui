'use client';

import { ChevronDown, Play } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import Tooltip from '@/base-ui/Tooltip';
import Icon from '@/Icon';
import ScrollShadow from '@/ScrollShadow';

import { useConsoleShellState } from '../ConsoleShell/context';
import { useLocalStorage, usePrefersReducedMotion } from '../hooks';
import { collectNavItems, findActiveBranch, resolveActiveHref } from './active';
import { styles } from './style';
import type { ConsoleNavGroup, ConsoleNavItem, ConsoleNavLinkProps, ConsoleNavProps } from './type';

const PANEL_TRANSITION_MS = 160;

type ExpandedOverrides = Record<string, boolean>;

/** Older builds stored the closed group keys as an array. */
function readOverrides(value: unknown): ExpandedOverrides {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((key) => [String(key), false]));
  }
  return value && typeof value === 'object' ? (value as ExpandedOverrides) : {};
}

function scrollActiveIntoView(container: HTMLElement) {
  const link =
    container.querySelector<HTMLElement>('[aria-current="page"]') ??
    [...container.querySelectorAll<HTMLElement>('button[data-active="true"]')].at(-1);
  if (!link) return;
  const containerRect = container.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  if (linkRect.top >= containerRect.top && linkRect.bottom <= containerRect.bottom) return;
  container.scrollTop +=
    linkRect.top - containerRect.top - (containerRect.height - linkRect.height) / 2;
}

interface LinkContext {
  onNavigate?: (href: string) => void;
  renderLink?: ConsoleNavProps['renderLink'];
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
}: {
  active: boolean;
  collapsed: boolean;
  context: LinkContext;
  href: string;
  icon?: ConsoleNavItem['icon'];
  indent?: number;
  item?: ConsoleNavItem;
  name: string;
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
    'children': (
      <>
        {icon ? <Icon icon={icon} size={18} /> : null}
        {collapsed ? null : <span className={styles.itemLabel}>{label}</span>}
        {!collapsed && item?.badge ? <span className={styles.badge}>{item.badge}</span> : null}
        {collapsed && item?.badge ? <span aria-hidden className={styles.dot} /> : null}
      </>
    ),
    'className': styles.item,
    'data-active': active,
    'data-collapsed': collapsed,
    'data-indent': indent,
    'external': item?.external,
    href,
    'onClick': follow,
    'title': collapsed ? undefined : label,
  };

  const link = context.renderLink ? (
    context.renderLink(linkProps)
  ) : (
    <a
      aria-current={linkProps['aria-current']}
      aria-label={linkProps['aria-label']}
      className={linkProps.className}
      data-active={active}
      data-collapsed={collapsed}
      data-indent={indent}
      href={href}
      rel={item?.external ? 'noreferrer' : undefined}
      target={item?.external ? '_blank' : undefined}
      title={linkProps.title}
      onClick={(event) => {
        if (context.onNavigate && !item?.external) event.preventDefault();
        follow();
      }}
    >
      {linkProps.children}
    </a>
  );

  if (!collapsed) return link;
  return (
    <Tooltip placement="right" title={name}>
      {link}
    </Tooltip>
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
  }, [activeHref, collapsed, pathname, reducedMotion]);

  const renderItems = (list: ConsoleNavItem[], indent: number, groupLabel?: string) =>
    list.map((item) => (
      <NavLink
        active={item.href === activeHref}
        collapsed={false}
        context={context}
        href={item.href}
        icon={item.icon}
        indent={item.icon ? Math.max(0, indent - 1) : indent}
        item={item}
        key={item.href}
        name={groupLabel ? `${groupLabel} / ${item.label}` : item.label}
      />
    ));

  if (collapsed) {
    const railItems = (list: ConsoleNavItem[], groupLabel?: string) =>
      list
        .filter((item) => item.icon)
        .map((item) => (
          <NavLink
            collapsed
            active={item.href === activeHref}
            context={context}
            href={item.href}
            icon={item.icon}
            item={item}
            key={item.href}
            name={groupLabel ? `${groupLabel} / ${item.label}` : item.label}
          />
        ));
    const topRail = railItems(items);
    const iconGroups = groups.filter((group) => group.icon);

    return (
      <ScrollShadow
        aria-label={label}
        as={'nav'}
        className={styles.nav}
        data-collapsed=""
        orientation={'vertical'}
        ref={navRef}
        size={8}
      >
        {topRail.length > 0 ? <div className={styles.railTop}>{topRail}</div> : null}
        {iconGroups.length > 0 ? (
          <div className={styles.railGroup} data-first={topRail.length === 0} role="group">
            {iconGroups.map((group) => {
              const href = group.href ?? collectNavItems([group])[0]?.href;
              if (!href) return null;
              return (
                <NavLink
                  collapsed
                  active={activeBranch[0] === group.key}
                  context={context}
                  href={href}
                  icon={group.icon}
                  key={group.key}
                  name={group.label}
                />
              );
            })}
          </div>
        ) : null}
        {groups
          .filter((group) => !group.icon)
          .map((group, index) => {
            const rail = railItems(collectNavItems([group]), group.label);
            if (rail.length === 0) return null;
            return (
              <div
                className={styles.railGroup}
                data-first={topRail.length === 0 && iconGroups.length === 0 && index === 0}
                key={group.key}
                role="group"
              >
                <h2 className={styles.srOnly}>{group.label}</h2>
                {rail}
              </div>
            );
          })}
      </ScrollShadow>
    );
  }

  const renderGroup = (group: ConsoleNavGroup, level: number, indent: number) => {
    const expanded = isExpanded(group);
    const panelId = `${id}-${group.key}`;
    // Nested groups are headings over their items, so the items keep the same indent.
    const childIndent = indent + (group.icon ? 1 : 0);
    const active = activeBranch.includes(group.key);

    return (
      <div
        className={styles.group}
        data-icon={Boolean(group.icon)}
        data-level={level}
        key={group.key}
      >
        <button
          aria-controls={panelId}
          aria-expanded={expanded}
          className={styles.groupHeader}
          data-active={active}
          data-icon={Boolean(group.icon)}
          data-indent={indent}
          data-level={level}
          type="button"
          onClick={() => toggleGroup(group.key, expanded)}
        >
          {group.icon ? <Icon icon={group.icon} size={16} /> : null}
          <span className={styles.itemLabel} data-label="">
            {group.label}
          </span>
          {level === 0 ? (
            <Icon
              className={styles.chevron}
              data-expanded={expanded}
              icon={ChevronDown}
              size={14}
            />
          ) : (
            <span className={styles.indicator} data-expanded={expanded}>
              <Play fill={'currentColor'} size={7} strokeWidth={1} />
            </span>
          )}
        </button>
        <div
          aria-hidden={!expanded}
          className={styles.groupPanel}
          data-expanded={expanded}
          data-instant={reducedMotion}
          id={panelId}
          inert={expanded ? undefined : true}
        >
          <div className={styles.groupItems}>
            {renderItems(group.items ?? [], childIndent, group.label)}
            {(group.groups ?? []).map((child) => renderGroup(child, level + 1, childIndent))}
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
      orientation={'vertical'}
      ref={navRef}
      size={4}
    >
      {items.length > 0 ? (
        <div className={styles.topItems} data-divided={groups.length > 0}>
          {renderItems(items, 0)}
        </div>
      ) : null}
      {groups.map((group) => renderGroup(group, 0, 0))}
    </ScrollShadow>
  );
}

ConsoleNav.displayName = 'ConsoleNav';

export default ConsoleNav;
