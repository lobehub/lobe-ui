import type { LobeCssVar, LobeToken } from '@lobehub/ui';

export type TokenKey = keyof LobeCssVar & keyof LobeToken;

export type TokenPreview = 'color' | 'text' | 'shadow' | 'radius' | 'font' | 'fontSize';

export interface TokenRow {
  alias?: TokenKey;
  key: TokenKey;
  role: string;
}

export interface TokenGroup {
  preview: TokenPreview;
  rows: TokenRow[];
}

export const surfaceTokens: TokenGroup = {
  preview: 'color',
  rows: [
    { key: 'colorBgLayout', role: 'Page background behind cards and panels' },
    { key: 'colorBgContainer', role: 'Cards, inputs, tables, the default surface' },
    { key: 'colorBgElevated', role: 'Popovers, menus, dialogs, floating sheets' },
    { key: 'colorBgMask', role: 'Modal and drawer backdrop' },
  ],
};

export const textTokens: TokenGroup = {
  preview: 'text',
  rows: [
    { key: 'colorText', role: 'Body copy, titles, active icons' },
    { key: 'colorTextSecondary', role: 'Supporting copy, labels' },
    { key: 'colorTextTertiary', role: 'Descriptions, idle icons, timestamps' },
    { key: 'colorTextQuaternary', role: 'Placeholders, disabled text' },
    { alias: 'colorText', key: 'colorTextHeading', role: 'Headings' },
    { alias: 'colorTextSecondary', key: 'colorTextLabel', role: 'Form labels' },
    { alias: 'colorTextTertiary', key: 'colorTextDescription', role: 'Descriptions' },
    { alias: 'colorTextTertiary', key: 'colorIcon', role: 'Idle icons' },
    { alias: 'colorTextQuaternary', key: 'colorTextPlaceholder', role: 'Input placeholders' },
    { alias: 'colorTextQuaternary', key: 'colorTextDisabled', role: 'Disabled text' },
  ],
};

export const borderTokens: TokenGroup = {
  preview: 'color',
  rows: [
    { key: 'colorBorder', role: 'Inputs and outlined controls' },
    { key: 'colorBorderSecondary', role: 'Card edges and dividers inside containers' },
    { key: 'colorSplit', role: 'Translucent hairlines in tables and drawers' },
  ],
};

export const fillTokens: TokenGroup = {
  preview: 'color',
  rows: [
    { key: 'colorFill', role: 'Pressed state, strong chips' },
    { key: 'colorFillSecondary', role: 'Hover state' },
    { key: 'colorFillTertiary', role: 'Filled inputs, tags, idle controls' },
    { key: 'colorFillQuaternary', role: 'Subtle backgrounds: code, quotes, zebra rows' },
  ],
};

export const shadowTokens: TokenGroup = {
  preview: 'shadow',
  rows: [
    { key: 'boxShadow', role: 'Modals' },
    { key: 'boxShadowSecondary', role: 'Menus, popovers, toasts, floating panels' },
    { key: 'boxShadowTertiary', role: 'Tooltips, tabs, resting cards' },
  ],
};

export const primaryTokens: TokenGroup = {
  preview: 'color',
  rows: [
    { key: 'colorPrimary', role: 'Primary buttons, checked controls, focus' },
    { key: 'colorPrimaryHover', role: 'Primary hover' },
    { key: 'colorPrimaryActive', role: 'Primary pressed' },
    { key: 'colorPrimaryBg', role: 'Selected rows and items' },
    { key: 'colorPrimaryBorder', role: 'Selected outlines' },
    { key: 'colorPrimaryBorderHover', role: 'Selected outline hover' },
    { key: 'colorLink', role: 'Links (follows colorInfoText)' },
  ],
};

export const radiusTokens: TokenGroup = {
  preview: 'radius',
  rows: [
    { key: 'borderRadiusXS', role: 'Inline chips and tiny previews' },
    { key: 'borderRadiusSM', role: 'Small controls, tags' },
    { key: 'borderRadius', role: 'Buttons, inputs' },
    { key: 'borderRadiusLG', role: 'Cards, popovers, dialogs' },
  ],
};

export const fontTokens: TokenGroup = {
  preview: 'font',
  rows: [
    { key: 'fontFamily', role: 'Interface and body text' },
    { key: 'fontFamilyCode', role: 'Code, keys, numbers in tables' },
  ],
};

export const fontSizeTokens: TokenGroup = {
  preview: 'fontSize',
  rows: [
    { key: 'fontSizeHeading2', role: 'Page titles' },
    { key: 'fontSizeHeading3', role: 'Section titles' },
    { key: 'fontSizeHeading4', role: 'Card titles' },
    { key: 'fontSizeLG', role: 'Large controls, lead copy' },
    { key: 'fontSize', role: 'Body text, default controls' },
    { key: 'fontSizeSM', role: 'Captions, small controls' },
  ],
};

export const statusTypes = ['Error', 'Warning', 'Info', 'Success'] as const;

export type StatusType = (typeof statusTypes)[number];

export const statusRoles = [
  { role: 'Alert and Tag background', suffix: 'Bg' },
  { role: 'Background hover', suffix: 'BgHover' },
  { role: 'Outlined border', suffix: 'Border' },
  { role: 'Border hover', suffix: 'BorderHover' },
  { role: 'Translucent fill', suffix: 'FillTertiary' },
  { role: 'Icons, dots, solid buttons', suffix: '' },
  { role: 'Solid hover', suffix: 'Hover' },
  { role: 'Solid pressed', suffix: 'Active' },
  { role: 'Status copy', suffix: 'Text' },
] as const;

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

export const motionTokens = {
  durations: ['motionDurationFast', 'motionDurationMid', 'motionDurationSlow'],
  easings: [
    { key: 'motionEaseOut', role: 'Enter, hover feedback' },
    { key: 'motionEaseInOut', role: 'Moving between two resting states' },
    { key: 'motionEaseInOutCirc', role: 'Long, emphasized moves' },
    { key: 'motionSpringSmooth', role: 'Spring, no overshoot (ζ 1.0)' },
    { key: 'motionSpringSnappy', role: 'Spring, 1.5% overshoot (ζ 0.8): Toast, FloatingPanel' },
    { key: 'motionSpringBouncy', role: 'Spring, 4.6% overshoot (ζ 0.7): Tooltip, Popover' },
  ],
} as const satisfies {
  durations: readonly TokenKey[];
  easings: readonly { key: TokenKey; role: string }[];
};
