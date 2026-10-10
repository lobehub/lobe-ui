'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronDown, Play } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';

import Icon from '@/Icon';
import ScrollShadow from '@/ScrollShadow';
import Tooltip from '@/Tooltip';

import { useConsoleShellState } from '../ConsoleShell/context';
import { useLocalStorage, usePrefersReducedMotion } from '../hooks';
import { collectNavItems, findActiveBranch, resolveActiveHref } from './active';
import { styles } from './style';
import type { ConsoleNavGroup, ConsoleNavItem, ConsoleNavLinkProps, ConsoleNavProps } from './type';

const PANEL_TRANSITION_MS = 160;
const railLinkClassName = 'lobe-console-nav-rail-link';

const itemIndentStyles = [null, styles.itemIndent1, styles.itemIndent2];
const groupHeaderIndentStyles = [null, styles.groupHeaderIndent1, styles.groupHeaderIndent2];
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
        {icon ? (
          <Icon className={stylex.props(styles.navIcon).className} icon={icon} size={18} />
        ) : null}
        <span
          {...stylex.props(
            styles.itemLabel,
            styles.railFade,
            collapsed && [styles.itemLabelRail, styles.railFaded],
          )}
        >
          {label}
        </span>
        {item?.badge ? (
          <span {...stylex.props(styles.badge, styles.railFade, collapsed && styles.railFaded)}>
            {item.badge}
          </span>
        ) : null}
        {item?.badge ? (
          <span aria-hidden {...stylex.props(styles.dot, collapsed && styles.dotRail)} />
        ) : null}
      </>
    ),
    'className': overlay
      ? clsx(
          stylex.props(styles.railLink, active && styles.railLinkActive).className,
          railLinkClassName,
        )
      : (stylex.props(
          styles.item,
          active && styles.itemActive,
          (indent === 1 || indent === 2) && styles.itemIndented,
          itemIndentStyles[indent],
          collapsed && indent !== 0 && styles.itemRailIndent,
        ).className ?? ''),
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
      data-folded={folded}
      inert={folded || undefined}
      {...stylex.props(styles.fold, folded && styles.folded)}
    >
      <div {...stylex.props(styles.foldBody)}>{children}</div>
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
    afterGroup: boolean,
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
    const nested = level !== 0;
    const headerIconClassName = stylex.props(
      styles.headerIcon,
      Boolean(group.icon) && styles.headerIconWide,
    ).className;

    const header = (
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-hidden={(onRail && railIcon) || undefined}
        data-active={active}
        data-icon={Boolean(group.icon)}
        data-indent={indent}
        data-level={level}
        tabIndex={onRail && railIcon ? -1 : undefined}
        type="button"
        onClick={() => toggleGroup(group.key, expanded)}
        {...stylex.props(
          styles.groupHeader,
          active && styles.groupHeaderActive,
          Boolean(group.icon) && styles.groupHeaderIcon,
          !nested && Boolean(group.icon) && styles.groupHeaderRailIcon,
          nested && styles.groupHeaderNested,
          nested && active && styles.groupHeaderNestedActive,
          groupHeaderIndentStyles[indent],
        )}
      >
        {group.icon ? <Icon className={headerIconClassName} icon={group.icon} size={16} /> : null}
        <span
          data-label=""
          {...stylex.props(
            styles.itemLabel,
            styles.railFade,
            collapsed && [styles.itemLabelRail, styles.railFaded],
            nested && styles.groupLabelNested,
          )}
        >
          {group.label}
        </span>
        {level === 0 ? (
          <Icon
            data-expanded={expanded}
            icon={ChevronDown}
            size={14}
            className={clsx(
              headerIconClassName,
              stylex.props(
                styles.chevron,
                !expanded && styles.chevronFolded,
                collapsed && styles.railFaded,
              ).className,
            )}
          />
        ) : (
          <span
            data-expanded={expanded}
            {...stylex.props(styles.indicator, expanded && styles.indicatorExpanded)}
          >
            <Play fill={'currentColor'} size={7} strokeWidth={1} />
          </span>
        )}
      </button>
    );

    let head: ReactNode = header;
    if (railIcon) {
      head = (
        <div {...stylex.props(styles.groupHead)}>
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
        data-icon={Boolean(group.icon)}
        data-level={level}
        data-rail-empty={railEmpty}
        key={group.key}
        {...stylex.props(
          styles.group,
          !nested && Boolean(group.icon) && styles.groupLevelIcon,
          nested && styles.groupNested,
          collapsed && railEmpty && styles.groupRailEmpty,
          collapsed && afterGroup && !nested && !group.icon && styles.groupDivider,
        )}
      >
        {head}
        <div
          aria-hidden={!open}
          data-expanded={open}
          data-instant={reducedMotion}
          id={panelId}
          inert={open ? undefined : true}
          {...stylex.props(
            styles.groupPanel,
            !open && styles.groupPanelCollapsed,
            reducedMotion && styles.groupPanelInstant,
          )}
        >
          <div {...stylex.props(styles.groupItems)}>
            {renderItems(group.items ?? [], childIndent, group.label, !(underRailIcon || railIcon))}
            {(group.groups ?? []).map((child, index) =>
              renderGroup(child, level + 1, childIndent, underRailIcon || railIcon, index > 0),
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
      className={stylex.props(styles.nav).className}
      data-collapsed={collapsed}
      orientation={'vertical'}
      ref={navRef}
      size={4}
    >
      {items.length > 0 ? (
        <div
          data-divided={groups.length > 0}
          data-rail-empty={!items.some((item) => item.icon)}
          {...stylex.props(
            styles.topItems,
            groups.length > 0 && styles.topItemsDivided,
            collapsed && !items.some((item) => item.icon) && styles.topItemsRailEmpty,
          )}
        >
          {renderItems(items, 0, undefined, true)}
        </div>
      ) : null}
      {groups.map((group, index) => renderGroup(group, 0, 0, false, index > 0))}
    </ScrollShadow>
  );
}

ConsoleNav.displayName = 'ConsoleNav';

export default ConsoleNav;
