import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, css, token, isDarkMode, responsive },
    {
      placement,
      type,
      title,
      primary,
      avatarSize,
      showTitle,
      editing,
    }: {
      avatarSize?: number;
      editing?: boolean;
      placement?: 'left' | 'right';
      primary?: boolean;
      showTitle?: boolean;
      title?: string;
      type?: 'block' | 'pure';
    },
  ) => {
    const blockStylish = css`
      padding: 8px 12px;
      background-color: ${primary
        ? isDarkMode
          ? token.colorFill
          : token.colorBgElevated
        : isDarkMode
        ? token.colorFillSecondary
        : token.colorBgContainer};
      border-radius: ${token.borderRadiusLG}px;
      transition: background-color 100ms ${token.motionEaseOut};
    `;

    const pureStylish = css`
      padding-top: ${title ? 0 : '6px'};
    `;

    const pureContainerStylish = css`
      margin-bottom: -16px;
      transition: background-color 100ms ${token.motionEaseOut};
    `;

    const typeStylish = type === 'block' ? blockStylish : pureStylish;

    const editingStylish =
      editing &&
      css`
        width: 100%;
      `;

    return {
      actions: cx(
        css`
          align-self: ${type === 'block'
            ? 'flex-end'
            : placement === 'left'
            ? 'flex-start'
            : 'flex-end'};
          justify-content: ${placement === 'left' ? 'flex-end' : 'flex-start'};
        `,
        editing &&
          css`
            pointer-events: none !important;
            opacity: 0 !important;
          `,
      ),
      alert: css``,
      avatarContainer: css`
        position: relative;
        flex: none;
        width: ${avatarSize}px;
        height: ${avatarSize}px;
      `,
      avatarGroupContainer: css`
        width: ${avatarSize}px;
      `,
      container: cx(
        type === 'pure' && pureContainerStylish,
        css`
          position: relative;
          width: 100%;
          max-width: 100vw;
          padding: 12px 16px;

          time {
            display: inline-block;
            white-space: nowrap;
          }

          div[role='widget'] {
            display: flex;
          }

          time,
          div[role='widget'] {
            pointer-events: none;
            opacity: 0;
            transition: opacity 200ms ${token.motionEaseOut};
          }

          &:hover {
            time,
            div[role='widget'] {
              pointer-events: unset;
              opacity: 1;
            }
          }

          ${responsive.mobile} {
            padding: 4px 16px;
          }
        `,
      ),
      editingContainer: cx(
        editingStylish,
        css`
          padding: 8px 12px 12px;
          border: 1px solid ${token.colorBorderSecondary};

          &:active,
          &:hover {
            border-color: ${token.colorBorder};
          }
        `,
        type === 'pure' &&
          css`
            background: ${token.colorFillQuaternary};
            border-radius: ${token.borderRadius}px;
          `,
      ),
      editingInput: css`
        width: 100%;
      `,
      loading: css`
        position: absolute;
        right: ${placement === 'left' ? '-4px' : 'unset'};
        bottom: 0;
        left: ${placement === 'right' ? '-4px' : 'unset'};

        width: 16px;
        height: 16px;

        color: ${token.colorBgLayout};

        background: ${token.colorPrimary};
        border-radius: 50%;
      `,
      message: cx(
        typeStylish,
        css`
          position: relative;
        `,
      ),
      messageContainer: cx(
        editingStylish,
        css`
          position: relative;
        `,
      ),
      messageContent: cx(
        editingStylish,
        css`
          position: relative;
          overflow-x: hidden;

          ${responsive.mobile} {
            flex-direction: column !important;
          }
        `,
      ),
      messageExtra: cx('message-extra'),
      name: css`
        position: ${showTitle ? 'relative' : 'absolute'};
        top: ${showTitle ? 'unset' : '-16px'};
        right: ${placement === 'right' ? '0' : 'unset'};
        left: ${placement === 'left' ? '0' : 'unset'};

        margin-bottom: 6px;

        font-size: 12px;
        line-height: 1;
        color: ${token.colorTextDescription};
        text-align: ${placement === 'left' ? 'left' : 'right'};
      `,
    };
  },
);
