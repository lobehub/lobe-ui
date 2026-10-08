import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

export const styles = stylex.create({
  center: {
    overflow: 'hidden',
    position: 'relative',
  },
  container: {
    overflow: 'hidden',
    alignSelf: 'stretch',
    backgroundColor: cssVar.colorBgContainer,
    borderBlockEndColor: cssVar.colorBorderSecondary,
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    gridColumnEnd: 'header',
    gridColumnStart: 'header',
    gridRowEnd: 'header',
    gridRowStart: 'header',
    position: 'absolute',
    zIndex: 10,
    height: 52,
    maxHeight: 52,
    minHeight: 52,
    width: '100%',
  },
  left: {
    flex: '1',
    overflow: 'hidden',
    paddingInlineStart: 8,
    position: 'relative',
  },
  right: {
    flex: 'none',
    overflow: 'hidden',
    position: 'relative',
  },
});

export const titleStyles = stylex.create({
  container: {
    flex: '1',
    overflow: 'hidden',
    position: 'relative',
    maxWidth: '100%',
  },
  desc: {
    overflow: 'hidden',
    color: cssVar.colorTextTertiary,
    fontSize: 12,
    lineHeight: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  tag: {
    flex: 'none',
    alignItems: 'baseline',
  },
  title: {
    overflow: 'hidden',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleContainer: {
    flex: '1',
    lineHeight: 1,
  },
  titleWithDesc: {
    overflow: 'hidden',
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});
