import { createStaticStyles } from 'antd-style';

/**
 * A content card sitting on the workspace.
 *
 * Outlined `Block` uses `colorBorderSecondary` on `colorBgContainer`.
 * The workspace is already that container, so a card inside it steps up to
 * `colorBgElevated` and `colorBorder`.
 */
export const styles = createStaticStyles(({ css, cssVar }) => ({
  card: css`
    &&,
    &&:hover {
      border: 1px solid ${cssVar.colorBorder};
      border-radius: ${cssVar.borderRadiusLG};
      background: ${cssVar.colorBgElevated};
      box-shadow: ${cssVar.boxShadowTertiary};
    }
  `,
}));
