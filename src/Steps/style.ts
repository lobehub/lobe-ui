import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  body: {
    gap: 2,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  connector: {
    flex: '1',
    backgroundColor: cssVar.colorBorderSecondary,
    height: 1,
    minWidth: 16,
  },
  connectorFinish: {
    backgroundColor: cssVar.colorPrimary,
  },
  connectorVertical: {
    insetBlockEnd: 4,
    insetBlockStart: 26,
    insetInlineStart: 11,
    position: 'absolute',
    height: 'auto',
    minWidth: 0,
    width: 1,
  },
  description: {
    color: cssVar.colorTextSecondary,
    fontSize: 13,
    lineHeight: 1.5,
  },
  dot: {
    borderColor: 'currentcolor',
    borderStyle: 'none',
    borderWidth: 0,
    backgroundColor: cssVar.colorTextQuaternary,
    marginBlockStart: 8,
    height: 7,
    width: 7,
  },
  dotActive: {
    backgroundColor: cssVar.colorPrimary,
  },
  horizontal: {
    gap: 8,
    alignItems: 'center',
    display: 'flex',
  },
  indicator: {
    borderColor: cssVar.colorBorder,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    flex: 'none',
    alignItems: 'center',
    color: cssVar.colorTextDescription,
    display: 'inline-flex',
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    justifyContent: 'center',
    height: 22,
    width: 22,
  },
  indicatorError: {
    borderColor: cssVar.colorError,
    color: cssVar.colorError,
  },
  indicatorFinish: {
    borderColor: cssVar.colorPrimary,
    color: cssVar.colorPrimary,
  },
  indicatorGuide: {
    color: cssVar.colorTextSecondary,
  },
  indicatorProcess: {
    borderColor: cssVar.colorPrimary,
    backgroundColor: cssVar.colorPrimary,
    color: cssVar.colorBgContainer,
  },
  itemHorizontal: {
    flex: '1',
    gap: 8,
    alignItems: 'center',
    display: 'flex',
    minWidth: 0,
  },
  itemHorizontalLast: {
    flex: 'none',
  },
  itemVertical: {
    columnGap: 12,
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr)',
    paddingBlockEnd: 18,
    position: 'relative',
  },
  itemVerticalLast: {
    paddingBlockEnd: 0,
  },
  root: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  title: {
    color: cssVar.colorTextDescription,
    fontSize: 14,
    lineHeight: '22px',
    whiteSpace: 'nowrap',
  },
  titleActive: {
    color: cssVar.colorText,
  },
  titleError: {
    color: cssVar.colorError,
  },
  titleProcess: {
    fontWeight: 500,
  },
  titleVertical: {
    whiteSpace: 'normal',
  },
  vertical: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const indicatorStatusStyles = {
  error: styles.indicatorError,
  finish: styles.indicatorFinish,
  guide: styles.indicatorGuide,
  process: styles.indicatorProcess,
  wait: null,
};

export const titleStatusStyles = {
  error: styles.titleError,
  finish: styles.titleActive,
  guide: styles.titleActive,
  process: [styles.titleActive, styles.titleProcess],
  wait: null,
};
