import { BaseDataModel } from './meta';

export type MessageRoleType = 'user' | 'system' | 'assistant' | 'function';

/**
 * 聊天消息错误对象
 */
export interface ChatMessageError {
  /**
   * 错误信息
   */
  message: string;
  type?: string;
}

export interface ChatMessage extends BaseDataModel {
  /**
   * @title 内容
   * @description 消息内容
   */
  content: string;

  error?: ChatMessageError;

  // 扩展字段
  extra?: {
    // 翻译
    translate?: {
      target: string;
      to: string;
    };
  } & Record<string, any>;
  parentId?: string;
  // 引用
  quotaId?: string;
  /**
   * 角色
   * @description 消息发送者的角色
   */
  role: MessageRoleType;
}
