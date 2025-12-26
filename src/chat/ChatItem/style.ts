import { createStaticStyles, responsive } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  const blockStylish = css`
    padding-block: 8px;
    padding-inline: 12px;
    border: 1px solid color-mix(in srgb, ${cssVar.colorBorderSecondary} 66%, transparent);
    border-radius: ${cssVar.borderRadiusLG};

    background-color: ${cssVar.colorBgContainer};
  `;

  const rawStylishWithTitle = css`
    padding-block-start: 0;
  `;

  const rawStylishWithoutTitle = css`
    padding-block-start: 6px;
  `;

  const rawContainerStylish = css`
    margin-block-end: -16px;
    transition: background-color 100ms ${cssVar.motionEaseOut};
  `;

  const editingStylish = css`
    width: 100%;
  `;

  return {
    // Actions styles - placement + variant + editing combinations
    actionsBubbleLeft: css`
      flex: none;
      align-self: flex-end;
      justify-content: flex-end;
    `,
    actionsBubbleRight: css`
      flex: none;
      align-self: flex-end;
      justify-content: flex-start;
    `,
    actionsDocsLeft: css`
      flex: none;
      align-self: flex-start;
      justify-content: flex-end;
    `,
    actionsDocsRight: css`
      flex: none;
      align-self: flex-end;
      justify-content: flex-start;
    `,
    actionsEditing: css`
      pointer-events: none !important;
      opacity: 0 !important;
    `,

    avatarContainer: css`
      position: relative;
      flex: none;
      width: var(--chat-item-avatar-size, 40px);
      height: var(--chat-item-avatar-size, 40px);
    `,
    avatarGroupContainer: css`
      width: var(--chat-item-avatar-size, 40px);
    `,
    container: css`
      position: relative;

      width: 100%;
      max-width: 100vw;
      padding-block: 24px 12px;
      padding-inline: 12px;

      time {
        display: inline-block;
        white-space: nowrap;
      }

      div[role='menubar'] {
        display: flex;
      }

      time,
      div[role='menubar'] {
        pointer-events: none;
        opacity: 0;
        transition: opacity 200ms ${cssVar.motionEaseOut};
      }

      &:hover {
        time,
        div[role='menubar'] {
          pointer-events: unset;
          opacity: 1;
        }
      }

      ${responsive.sm} {
        padding-block-start: 12px;
        padding-inline: 8px;
      }
    `,

    containerDocs: css`
      ${rawContainerStylish}
      position: relative;

      width: 100%;
      max-width: 100vw;
      padding-block: 24px 12px;
      padding-inline: 12px;

      time {
        display: inline-block;
        white-space: nowrap;
      }

      div[role='menubar'] {
        display: flex;
      }

      time,
      div[role='menubar'] {
        pointer-events: none;
        opacity: 0;
        transition: opacity 200ms ${cssVar.motionEaseOut};
      }

      &:hover {
        time,
        div[role='menubar'] {
          pointer-events: unset;
          opacity: 1;
        }
      }

      ${responsive.sm} {
        padding-block-start: 16px;
        padding-inline: 8px;
      }
    `,
    editingContainer: css`
      ${editingStylish}
      padding-block: 8px 12px;
      padding-inline: 12px;
      border: 1px solid ${cssVar.colorBorderSecondary};

      &:active,
      &:hover {
        border-color: ${cssVar.colorBorder};
      }
    `,

    editingContainerDocs: css`
      ${editingStylish}
      padding-block: 8px 12px;
      padding-inline: 12px;
      border: 1px solid ${cssVar.colorBorderSecondary};
      border-radius: ${cssVar.borderRadius};

      background: ${cssVar.colorFillQuaternary};

      &:active,
      &:hover {
        border-color: ${cssVar.colorBorder};
      }
    `,

    editingInput: css`
      width: 100%;
    `,

    errorContainer: css`
      position: relative;
      overflow: hidden;
      width: 100%;
    `,

    loadingLeft: css`
      position: absolute;
      inset-block-end: 0;
      inset-inline-start: -4px;

      width: 16px;
      height: 16px;
      border-radius: 50%;

      color: ${cssVar.colorBgLayout};

      background: ${cssVar.colorPrimary};
    `,

    loadingRight: css`
      position: absolute;
      inset-block-end: 0;
      inset-inline-end: -4px;

      width: 16px;
      height: 16px;
      border-radius: 50%;

      color: ${cssVar.colorBgLayout};

      background: ${cssVar.colorPrimary};
    `,

    messageBubble: css`
      ${blockStylish}
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        width: 100%;
      }
    `,

    messageContainer: css`
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        overflow-x: auto;
      }
    `,

    messageContainerEditing: css`
      ${editingStylish}
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        overflow-x: auto;
      }
    `,

    messageContainerEditingWithTime: css`
      ${editingStylish}
      position: relative;
      overflow: hidden;
      max-width: 100%;
      margin-block-start: -16px;

      ${responsive.sm} {
        overflow-x: auto;
      }
    `,

    messageContainerWithTime: css`
      position: relative;
      overflow: hidden;
      max-width: 100%;
      margin-block-start: -16px;

      ${responsive.sm} {
        overflow-x: auto;
      }
    `,

    messageContent: css`
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        flex-direction: column !important;
      }
    `,

    messageContentEditing: css`
      ${editingStylish}
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        flex-direction: column !important;
      }
    `,

    messageDocsWithTitle: css`
      ${rawStylishWithTitle}
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        width: 100%;
      }
    `,

    messageDocsWithoutTitle: css`
      ${rawStylishWithoutTitle}
      position: relative;
      overflow: hidden;
      max-width: 100%;

      ${responsive.sm} {
        width: 100%;
      }
    `,

    messageExtra: css`
      /* message-extra class */
    `,

    nameLeft: css`
      pointer-events: none;

      margin-block-end: 6px;

      font-size: 12px;
      line-height: 1;
      color: ${cssVar.colorTextDescription};
      text-align: start;
    `,

    nameRight: css`
      pointer-events: none;

      margin-block-end: 6px;

      font-size: 12px;
      line-height: 1;
      color: ${cssVar.colorTextDescription};
      text-align: end;
    `,
  };
});
