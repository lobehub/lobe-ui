import type { FC, ReactNode } from 'react';

import type { ActionIconGroupEvent, ActionIconGroupProps } from '@/ActionIconGroup';
import type { AlertProps } from '@/Alert';
import type { ChatItemProps } from '@/chat/ChatItem';
import type { ChatMessage, LLMRoleType } from '@/chat/types';
import type { DivProps } from '@/types';

export type OnMessageChange = (id: string, content: string) => void;
export type OnActionsClick = (action: ActionIconGroupEvent, message: ChatMessage) => void;
export type OnAvatatsClick = (role: RenderRole) => ChatItemProps['onAvatarClick'];
export type RenderRole = LLMRoleType | 'default' | string;
export type RenderItem = FC<{ key: string } & ChatMessage & ListItemProps>;
export type RenderMessage = FC<ChatMessage & { editableContent: ReactNode }>;
export type RenderMessageExtra = FC<ChatMessage>;
export interface RenderErrorMessage {
  config?: AlertProps;
  Render?: FC<ChatMessage>;
}
export type RenderAction = FC<ChatActionsBarProps & ChatMessage>;

export interface ListItemProps {
  groupNav?: ChatItemProps['avatarAddon'];
  loading?: boolean;
  /**
   * @description 点击操作按钮的回调函数
   */
  onActionsClick?: OnActionsClick;
  onAvatarsClick?: OnAvatatsClick;
  /**
   * @description 消息变化的回调函数
   */
  onMessageChange?: OnMessageChange;
  renderActions?: {
    [actionKey: string]: RenderAction;
  };
  /**
   * @description 渲染错误消息的函数
   */
  renderErrorMessages?: {
    [errorType: 'default' | string]: RenderErrorMessage;
  };
  renderItems?: {
    [role: RenderRole]: RenderItem;
  };
  /**
   * @description 渲染消息的函数
   */
  renderMessages?: {
    [role: RenderRole]: RenderMessage;
  };
  /**
   * @description 渲染消息额外内容的函数
   */
  renderMessagesExtra?: {
    [role: RenderRole]: RenderMessageExtra;
  };
  showAvatar?: boolean;
  /**
   * @description 是否显示聊天项的名称
   * @default false
   */
  showTitle?: boolean;
  /**
   * @description 文本内容
   */
  text?: ChatItemProps['text'] &
    ChatActionsBarProps['text'] & {
      copySuccess?: string;
      history?: string;
    } & {
      [key: string]: string;
    };
  /**
   * @description 聊天列表的类型
   * @default 'chat'
   */
  variant?: 'docs' | 'bubble';
}

export type ChatListItemProps = ChatMessage & ListItemProps;

export interface ChatListProps extends DivProps, ListItemProps {
  data: ChatMessage[];
  enableHistoryCount?: boolean;
  historyCount?: number;
  loadingId?: string;
}

export interface ChatActionsBarProps extends ActionIconGroupProps {
  text?: {
    copy?: string;
    delete?: string;
    edit?: string;
    regenerate?: string;
  };
}
