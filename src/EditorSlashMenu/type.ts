'use client';

import type { AutocompleteRootChangeEventDetails } from '@base-ui/react/autocomplete';
import type React from 'react';

export type EditorSlashMenuItemValue = string;

export type EditorSlashMenuOption = {
  /** Render danger style (red) */
  danger?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional extra content shown at the end */
  extra?: React.ReactNode;
  /** Optional icon shown at the start */
  icon?: React.ReactNode;
  /** Optional additional keywords for filtering */
  keywords?: string[];
  /** Visible label, also used for filtering by default */
  label: string;
  /** Unique id of the command */
  value: EditorSlashMenuItemValue;
};

export type EditorSlashMenuGroup = {
  items: EditorSlashMenuOption[];
  /** Optional group title */
  label?: string;
};

export type EditorSlashMenuItems = Array<EditorSlashMenuOption | EditorSlashMenuGroup>;

export type EditorSlashMenuOnOpenChange = (
  open: boolean,
  details: AutocompleteRootChangeEventDetails,
) => void;

export type EditorSlashMenuOnValueChange = (
  value: string,
  details: AutocompleteRootChangeEventDetails,
) => void;

export type EditorSlashMenuOnSelect = (
  item: EditorSlashMenuOption,
  details: AutocompleteRootChangeEventDetails,
) => void;

export type EditorSlashMenuValueToString = (item: EditorSlashMenuOption) => string;

export type EditorSlashMenuRenderItem = (item: EditorSlashMenuOption) => React.ReactNode;

export type EditorSlashMenuEmpty = React.ReactNode;

export type EditorSlashMenuRenderGroupLabel = (label: string) => React.ReactNode;

export type EditorSlashMenuPlacement = 'top' | 'bottom';
