import './style.css';

import type { CSSProperties } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = 'lobe-message-input-editor';

export const textAreaStyle: CSSProperties = {
  fontFamily: cssVar.fontFamilyCode,
  fontSize: 13,
  height: '100%',
  lineHeight: 1.8,
  position: 'relative',
};
