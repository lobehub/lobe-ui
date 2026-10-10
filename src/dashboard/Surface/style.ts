import * as stylex from '@stylexjs/stylex';

import { cssVar } from '@/styles/stylex/cssVar.stylex';

/**
 * A content card sitting on the workspace.
 *
 * Outlined `Block` uses `colorBorderSecondary` on `colorBgContainer`.
 * The workspace is already that container, so a card inside it steps up to
 * `colorBgElevated` and `colorBorder`.
 */
export const styles = stylex.create({
  card: {
    borderColor: cssVar.colorBorder,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: cssVar.colorBgElevated,
    boxShadow: cssVar.boxShadowTertiary,
  },
});

export const surfaceStyles = {
  card: stylex.props(styles.card).className ?? '',
};
