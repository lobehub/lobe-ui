import { ChatMessageError, MessageRoleType } from '@/types/chatMessage';

/**
 * @title ChatGPTMessage 聊天消息
 * @category Model
 */
export interface LLMMessage {
  /**
   * @title 内容
   * @description 消息内容
   */
  content: string;
  /**
   * 如果存在错误消息
   */
  error?: ChatMessageError;
  /**
   * @title 角色
   * @description 消息发送者的角色
   * @enum {MessageRoleType} ChatGPTAgent
   */
  role: MessageRoleType;
}
