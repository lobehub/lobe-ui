export type InternalChatContext = Omit<ChatContext, 'id'>;

export type MessageRoleType = 'user' | 'system' | 'assistant' | 'function';

/**
 * 聊天消息错误对象
 */
export interface ChatMessageError {
  /**
   * 错误信息
   */
  message: string;
  /**
   * 错误状态码
   */
  status: number;
  /**
   * 错误类型
   * @enum ["chatbot", "openai"]
   * @enumNames ["聊天机器人", "开放AI"]
   */
  type: 'chatbot' | 'openai';
}

/**
 * @title ChatGPTMessage 聊天消息
 * @category Model
 */
export interface ChatMessage {
  /**
   * 其余生成项
   */
  choices?: string[];
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

export interface ChatContext {
  // 创建时间戳
  createAt: number;
  /**
   * @title 会话描述
   * @description 用户设置的会话描述
   * @type {string}
   */
  description?: string;
  id: string;
  /**
   * @title 消息列表
   * @description 聊天室中的所有消息
   * @type {ChatMessage[]}
   */
  messages: ChatMessage[];
  /**
   * @title 会话标题
   */
  title?: string;
  // 更新时间
  updateAt: number;
}

export type ChatContextMap = Record<string, Omit<ChatContext, 'systemRole'>>;

/**
 * 请求数据类型
 */
export interface OpenAIRequestParameters {
  /**
   * 中间的聊天记录
   */
  messages?: ChatMessage[];
}
