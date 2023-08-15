import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { cx, css, token, isDarkMode },
    {
      placement,
      type,
      title,
      primary,
      avatarSize,
      showTitle,
    }: {
      avatarSize?: number;
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

    return {
      actions: css`
        display: flex;
        align-items: flex-start;
        align-self: ${type === 'block'
          ? 'flex-end'
          : placement === 'left'
          ? 'flex-start'
          : 'flex-end'};
        justify-content: ${placement === 'left' ? 'flex-end' : 'flex-start'};
      `,
      alert: css`
        span[role='img'] {
          align-self: flex-start;
          width: 16px;
          height: 16px;
          margin-top: 3px;
        }

        .ant-alert-description {
          text-align: justify;
          word-break: break-all;
          word-wrap: break-word;
        }

        &.ant-alert-with-description {
          padding-block: 12px;
          padding-inline: 12px;

          .ant-alert-message {
            font-size: 14px;
            font-weight: 600;
            text-align: justify;
            word-break: break-all;
            word-wrap: break-word;
          }
        }
      `,
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

          display: flex;
          flex-direction: ${placement === 'left' ? 'row' : 'row-reverse'};
          gap: 12px;
          align-items: flex-start;
          justify-content: revert;

          width: 100%;
          padding: 12px 16px;

          time {
            display: inline-block;
            white-space: nowrap;
          }

          div[role='chat-item-actions'] {
            display: flex;
          }

          time,
          div[role='chat-item-actions'] {
            pointer-events: none;
            opacity: 0;
            transition: opacity 200ms ${token.motionEaseOut};
          }

          &:hover {
            time,
            div[role='chat-item-actions'] {
              pointer-events: unset;
              opacity: 1;
            }
          }
        `,
      ),
      editingContainer: cx(
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
        min-width: 800px !important;
      `,
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
      message: cx(
        typeStylish,
        css`
          position: relative;
        `,
      ),
      messageContainer: css`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: ${placement === 'left' ? 'flex-start' : 'flex-end'};
      `,
      messageContent: css`
        position: revert;

        display: flex;
        flex-direction: ${type === 'block'
          ? placement === 'left'
            ? 'row'
            : 'row-reverse'
          : 'column'};
        gap: 8px;
        align-items: ${placement === 'left' ? 'flex-start' : 'flex-end'};
      `,
      messageExtra: cx('message-extra'),
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
    };
  },
);
