import type { LobeCssVar, LobeToken } from '@lobehub/ui';

export type TokenKey = keyof LobeCssVar & keyof LobeToken;

export type Preview =
  'surface' | 'color' | 'text' | 'border' | 'fill' | 'shadow' | 'radius' | 'font' | 'fontSize';

export interface TokenSpec {
  alias?: TokenKey;
  key: TokenKey;
  role: string;
}

export const surfaceTokens: TokenSpec[] = [
  { key: 'colorBgLayout', role: 'Page background behind cards and panels' },
  { key: 'colorBgContainer', role: 'Cards, inputs, tables: the default surface' },
  { key: 'colorBgElevated', role: 'Popovers, menus, dialogs, floating sheets' },
  { key: 'colorBgMask', role: 'Scrim behind modals and drawers' },
];

export const textTokens: TokenSpec[] = [
  { key: 'colorText', role: 'Body copy, titles, active icons' },
  { key: 'colorTextSecondary', role: 'Supporting copy, labels' },
  { key: 'colorTextTertiary', role: 'Descriptions, idle icons, timestamps' },
  { key: 'colorTextQuaternary', role: 'Placeholders, disabled text, separators' },
  { alias: 'colorText', key: 'colorTextHeading', role: 'Headings' },
  { alias: 'colorTextSecondary', key: 'colorTextLabel', role: 'Form labels' },
  { alias: 'colorTextTertiary', key: 'colorTextDescription', role: 'Descriptions' },
  { alias: 'colorTextTertiary', key: 'colorIcon', role: 'Idle icons' },
  { alias: 'colorTextQuaternary', key: 'colorTextPlaceholder', role: 'Input placeholders' },
  { alias: 'colorTextQuaternary', key: 'colorTextDisabled', role: 'Disabled text' },
];

export const borderTokens: TokenSpec[] = [
  { key: 'colorBorder', role: 'Inputs and outlined controls' },
  { key: 'colorBorderSecondary', role: 'Card edges, dividers inside containers' },
  { key: 'colorSplit', role: 'Translucent hairlines in tables and drawers' },
];

export const fillTokens: TokenSpec[] = [
  { key: 'colorFill', role: 'Pressed state, strong chips' },
  { key: 'colorFillSecondary', role: 'Hover state' },
  { key: 'colorFillTertiary', role: 'Filled inputs, tags, segmented tracks' },
  { key: 'colorFillQuaternary', role: 'Code blocks, quotes, zebra rows' },
];

export const shadowTokens: TokenSpec[] = [
  { key: 'boxShadowTertiary', role: 'Tooltips, active tabs, resting cards' },
  { key: 'boxShadowSecondary', role: 'Menus, popovers, toasts, floating panels' },
  { key: 'boxShadow', role: 'Modals, the largest elevation step' },
];

export const primaryTokens: TokenSpec[] = [
  { key: 'colorPrimary', role: 'Primary buttons, checked controls' },
  { key: 'colorPrimaryHover', role: 'Primary hover' },
  { key: 'colorPrimaryActive', role: 'Primary pressed' },
  { key: 'colorPrimaryBg', role: 'Selected rows and items' },
  { key: 'colorPrimaryBorder', role: 'Selected outlines' },
  { key: 'colorPrimaryBorderHover', role: 'Selected outline hover' },
  { alias: 'colorInfoText', key: 'colorLink', role: 'Links' },
];

export const radiusTokens: TokenSpec[] = [
  { key: 'borderRadiusXS', role: 'Inline code, tiny chips' },
  { key: 'borderRadiusSM', role: 'Small controls, tags, menu items' },
  { key: 'borderRadius', role: 'Buttons, inputs' },
  { key: 'borderRadiusLG', role: 'Cards, popovers, dialogs' },
];

export const fontFamilyTokens: TokenSpec[] = [
  { key: 'fontFamily', role: 'Interface and body text' },
  { key: 'fontFamilyCode', role: 'Code, keys, tabular numbers' },
];

export const fontSizeTokens: TokenSpec[] = [
  { key: 'fontSizeHeading2', role: 'Page titles' },
  { key: 'fontSizeHeading3', role: 'Section titles' },
  { key: 'fontSizeHeading4', role: 'Card titles' },
  { key: 'fontSizeLG', role: 'Large controls, lead copy' },
  { key: 'fontSize', role: 'Body text, default controls' },
  { key: 'fontSizeSM', role: 'Captions, small controls' },
];

export const statusTypes = ['Error', 'Warning', 'Info', 'Success'] as const;

export type StatusType = (typeof statusTypes)[number];

export const statusRoles = [
  { label: 'base', role: 'Icons, dots, solid buttons', suffix: '' },
  { label: 'Hover', role: 'Solid hover', suffix: 'Hover' },
  { label: 'Active', role: 'Solid pressed', suffix: 'Active' },
  { label: 'Bg', role: 'Alert and tag background', suffix: 'Bg' },
  { label: 'BgHover', role: 'Background hover', suffix: 'BgHover' },
  { label: 'Border', role: 'Outlined border', suffix: 'Border' },
  { label: 'BorderHover', role: 'Border hover', suffix: 'BorderHover' },
  { label: 'Text', role: 'Status copy', suffix: 'Text' },
  { label: 'FillTertiary', role: 'Translucent fill', suffix: 'FillTertiary' },
] as const;

export const statusKey = (status: StatusType, suffix: string) =>
  `color${status}${suffix}` as TokenKey;

export const hueKeys = [
  'red',
  'volcano',
  'orange',
  'gold',
  'yellow',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'magenta',
] as const satisfies readonly TokenKey[];

export const durationTokens = [
  'motionDurationFast',
  'motionDurationMid',
  'motionDurationSlow',
] as const satisfies readonly TokenKey[];

export const easingTokens = [
  { key: 'motionEaseOut', role: 'Enter, hover feedback' },
  { key: 'motionEaseInOut', role: 'Moving between two resting states' },
  { key: 'motionEaseInOutCirc', role: 'Long, emphasized moves' },
] as const satisfies readonly { key: TokenKey; role: string }[];

export const springTokens = [
  { key: 'motionSpringSmooth', overshoot: '0%', role: 'No overshoot', zeta: '1.0' },
  { key: 'motionSpringSnappy', overshoot: '1.5%', role: 'Toast, FloatingPanel', zeta: '0.8' },
  { key: 'motionSpringBouncy', overshoot: '4.6%', role: 'Tooltip, Popover', zeta: '0.7' },
] as const satisfies readonly { key: TokenKey; overshoot: string; role: string; zeta: string }[];
