import type { BreadcrumbItem, ConsoleNavGroup, ConsoleNavItem } from '@lobehub/ui/dashboard';
import { SkillsIcon } from '@lobehub/ui/icons';
import type { LucideIcon } from 'lucide-react';
import {
  Blocks,
  BookOpen,
  Bot,
  Component,
  ExternalLink,
  FileCode,
  FileText,
  Folder,
  Gem,
  History,
  House,
  LayoutDashboard,
  MessagesSquare,
  Palette,
  Shapes,
  Smartphone,
  Sparkles,
  Webhook,
} from 'lucide-react';

import {
  categoryOverviewPathname,
  findOverview,
  hasSubgroups,
  sectionOverviewPathname,
} from '../../content/sectionOverview';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';

const sectionIcons: Record<string, LucideIcon> = {
  'Awesome': Sparkles,
  'Base UI': Blocks,
  'Brand': Gem,
  'Chat': MessagesSquare,
  'Color': Palette,
  'Components': Component,
  'Dashboard': LayoutDashboard,
  'Guides': BookOpen,
  'Hooks & Providers': Webhook,
  'Icons': Shapes,
  'Mdx': FileCode,
  'Mobile': Smartphone,
  'StoryBook': BookOpen,
};

export const sectionIcon = (title: string): LucideIcon => sectionIcons[title] ?? Folder;

export interface DocsNavItemConfig {
  external?: boolean;
  href: string;
  label: string;
}

export interface TopLink {
  external: boolean;
  href: string;
  label: string;
}

export const CHANGELOG_PATHNAME = '/changelog';

/** Sections that lead the sidebar; everything else keeps manifest order. */
const PREFERRED_SECTION_TITLES = ['Components', 'Base UI'];

const sectionDocuments = (section: NavigationSection) =>
  section.categories.flatMap((category) => category.documents);

export const isExternalHref = (href: string) => /^[a-z][\d+.a-z-]*:/i.test(href);

export const sectionKey = (section: NavigationSection) => `section:${section.title}`;

export const categoryKey = (section: NavigationSection, categoryTitle: string) =>
  `${sectionKey(section)}/${categoryTitle}`;

export const SKILLS_PATHNAME = '/skills.md';
export const LLMS_PATHNAME = '/llms.txt';

// Raw text resources are not client routes, so they open as plain documents.
const agentLinks: TopLink[] = [
  { external: true, href: SKILLS_PATHNAME, label: 'skills.md' },
  { external: true, href: LLMS_PATHNAME, label: 'llms.txt' },
];

export function buildTopLinks(navItems: readonly DocsNavItemConfig[] = []): TopLink[] {
  const links: TopLink[] = navItems.map((item) => ({
    external: Boolean(item.external) || isExternalHref(item.href),
    href: item.href,
    label: item.label,
  }));
  const changelogIndex = links.findIndex((link) => link.href === CHANGELOG_PATHNAME);
  if (changelogIndex === -1) {
    links.push(...agentLinks, { external: false, href: CHANGELOG_PATHNAME, label: 'Changelog' });
  } else {
    links.splice(changelogIndex, 0, ...agentLinks);
  }
  return [{ external: false, href: '/', label: 'Home' }, ...links];
}

const topLinkIcons: Record<string, LucideIcon> = {
  '/': House,
  [CHANGELOG_PATHNAME]: History,
  [LLMS_PATHNAME]: Bot,
  [SKILLS_PATHNAME]: SkillsIcon,
};

const topLinkIcon = (link: TopLink): LucideIcon =>
  topLinkIcons[link.href] ?? (link.external ? ExternalLink : FileText);

export const buildNavItems = (navItems?: readonly DocsNavItemConfig[]): ConsoleNavItem[] =>
  buildTopLinks(navItems).map((link) => ({ end: true, icon: topLinkIcon(link), ...link }));

export function orderSections(navigation: readonly NavigationSection[]): NavigationSection[] {
  const sections = navigation.filter((section) => sectionDocuments(section).length > 0);
  const preferred = PREFERRED_SECTION_TITLES.flatMap((title) => {
    const section = sections.find((entry) => entry.title === title);
    return section ? [section] : [];
  });
  const rest = sections.filter((section) => !PREFERRED_SECTION_TITLES.includes(section.title));
  return [...preferred, ...rest];
}

const documentItems = (documents: readonly DocumentManifestEntry[]): ConsoleNavItem[] =>
  documents.map((document) => ({ end: true, href: document.pathname, label: document.title }));

/** Sections carry the icons; categories become nested groups when a section has several. */
export function buildNavGroups(navigation: readonly NavigationSection[]): ConsoleNavGroup[] {
  return orderSections(navigation).map((section): ConsoleNavGroup => {
    const base = {
      href: sectionOverviewPathname(section),
      icon: sectionIcon(section.title),
      key: sectionKey(section),
      label: section.title,
    };
    if (!hasSubgroups(section)) {
      return { ...base, items: documentItems(sectionDocuments(section)) };
    }
    return {
      ...base,
      groups: section.categories
        .filter((category) => category.documents.length > 0)
        .map((category) => ({
          defaultExpanded: true,
          href: categoryOverviewPathname(section, category),
          items: documentItems(category.documents),
          key: categoryKey(section, category.title),
          label: category.title,
        })),
    };
  });
}

export interface ActiveLocation {
  categoryTitle?: string;
  section: NavigationSection;
}

/** Resolves the section, and category when grouped, that owns a document or overview page. */
export function findActiveLocation(
  navigation: readonly NavigationSection[],
  pathname: string,
): ActiveLocation | undefined {
  const overview = findOverview(navigation, pathname);
  if (overview) return { categoryTitle: overview.category?.title, section: overview.section };

  for (const section of navigation) {
    const category = section.categories.find((entry) =>
      entry.documents.some((document) => document.pathname === pathname),
    );
    if (category) {
      return { categoryTitle: hasSubgroups(section) ? category.title : undefined, section };
    }
  }
  return undefined;
}

export function buildBreadcrumb(
  navigation: readonly NavigationSection[],
  documents: readonly DocumentManifestEntry[],
  pathname: string,
): BreadcrumbItem[] {
  if (pathname === '/') return [{ label: 'Home' }];

  const overview = findOverview(navigation, pathname);
  if (overview) {
    if (!overview.category) return [{ label: overview.section.title }];
    return [
      { href: sectionOverviewPathname(overview.section), label: overview.section.title },
      { label: overview.category.title },
    ];
  }

  const document = documents.find((entry) => entry.pathname === pathname);
  if (!document) return [{ href: '/', label: 'Home' }, { label: 'Not found' }];

  const active = findActiveLocation(navigation, pathname);
  if (!active) return [{ href: '/', label: 'Home' }, { label: document.title }];

  const category = active.categoryTitle
    ? active.section.categories.find((entry) => entry.title === active.categoryTitle)
    : undefined;

  return [
    {
      href: sectionOverviewPathname(active.section),
      label: active.section.title,
      optional: Boolean(category),
    },
    ...(category
      ? [{ href: categoryOverviewPathname(active.section, category), label: category.title }]
      : []),
    { label: document.title },
  ];
}
