import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, css, token },
    {
      placement,
      type,
      name,
      primary,
      avatarSize,
    }: {
      avatarSize: number;
      name?: string;
      placement?: 'left' | 'right';
      primary?: boolean;
      type?: 'block' | 'pure';
    },
  ) => {
    const blockStylish = css`
      padding: 8px 12px;
      background-color: ${primary ? token.colorFillSecondary : token.colorFillTertiary};
      border-radius: ${token.borderRadiusLG}px;
      transition: background-color 100ms ${token.motionEaseOut};

      &:active {
        background-color: ${primary ? token.colorFill : token.colorFillSecondary};
      }
    `;

    const pureStylish = css`
      padding-top: ${name ? 0 : '6px'};
    `;

    const pureContainerStylish = css`
      border-radius: ${token.borderRadiusLG}px;
      transition: background-color 100ms ${token.motionEaseOut};

      &:hover {
        background-color: ${token.colorFillTertiary};
      }

      &:active {
        background-color: ${token.colorFillSecondary};
      }
    `;

    const typeStylish = type === 'block' ? blockStylish : pureStylish;

    return {
      container: cx(
        type === 'pure' && pureContainerStylish,
        css`
          position: relative;

          display: flex;
          flex-direction: ${placement === 'left' ? 'row' : 'row-reverse'};
          gap: 12px;
          align-items: flex-start;
          justify-content: revert;

          width: 100%;
          padding: 12px;
        `,
      ),
      loading: css`
        position: absolute;
        right: ${placement === 'left' ? '-4px' : 'unset'};
        bottom: 0;
        left: ${placement === 'right' ? '-4px' : 'unset'};

        display: flex;
        align-items: center;
        justify-content: center;

        width: 16px;
        height: 16px;

        color: ${token.colorBgLayout};

        background: ${token.colorPrimary};
        border-radius: 50%;
      `,
      avatarContainer: css`
        position: relative;
        flex: none;
        width: ${avatarSize}px;
        height: ${avatarSize}px;
      `,
      messageContainer: css`
        position: relative;

        .ant-alert-with-description {
          padding-block: 12px;
          padding-inline: 12px;
        }
      `,
      name: css`
        margin-bottom: 6px;

        font-size: 12px;
        line-height: 1;
        color: ${token.colorTextDescription};
        text-align: ${placement === 'left' ? 'left' : 'right'};
      `,
      message: cx(
        typeStylish,
        css`
          position: relative;
        `,
      ),
    };
  },
);
