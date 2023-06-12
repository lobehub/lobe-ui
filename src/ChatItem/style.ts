import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, css, token, stylish },
    {
      placement,
      type,
      title,
      primary,
      avatarSize,
      showTitle,
    }: {
      avatarSize: number;
      placement?: 'left' | 'right';
      primary?: boolean;
      showTitle?: boolean;
      title?: string;
      type?: 'block' | 'pure';
    },
  ) => {
    const blockStylish = css`
      padding: 8px 12px;
      background-color: ${primary ? token.colorFillSecondary : token.colorFillTertiary};
      border-radius: ${token.borderRadiusLG}px;
      transition: background-color 100ms ${token.motionEaseOut};
    `;

    const pureStylish = css`
      padding-top: ${title ? 0 : '6px'};
    `;

    const pureContainerStylish = css`
      border-radius: ${token.borderRadiusLG}px;
      transition: background-color 100ms ${token.motionEaseOut};

      &:hover {
        background-color: ${token.colorFillTertiary};
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

          .chat-item-time {
            display: none;
          }

          &:hover {
            .chat-item-time {
              display: inline-block;
            }
          }
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
        position: ${showTitle ? 'relative' : 'absolute'};
        top: ${showTitle ? 'unset' : '-16px'};
        right: ${placement === 'right' ? '0' : 'unset'};
        left: ${placement === 'left' ? '0' : 'unset'};

        display: flex;
        flex-direction: ${placement === 'left' ? 'row' : 'row-reverse'};
        gap: 4px;

        margin-bottom: 6px;

        font-size: 12px;
        line-height: 1;
        color: ${token.colorTextDescription};
        text-align: ${placement === 'left' ? 'left' : 'right'};
      `,
      time: cx(
        stylish.blur,
        css`
          display: flex;
          align-items: center;
          justify-content: center;

          padding: 4px 6px;

          line-height: 1;

          background: ${token.colorFillQuaternary};
          border-radius: ${token.borderRadius}px;
        `,
      ),
      message: cx(
        typeStylish,
        css`
          position: relative;
        `,
      ),
    };
  },
);
