import { ChatMessage, InternalChatContext, OpenAIRequestParameters } from '../types';

export interface ChatState extends InternalChatContext {
  /**
   * @title 改变系统角色状态
   * @type {boolean}
   */
  changingSystemRole: boolean;
  /**
   * 编辑中的消息 id
   */
  editingMessageId?: number | undefined;
  /**
   * @title 加载状态
   * @type {boolean}
   */
  loading: boolean;
  /**
   * @title 消息
   * @type {string}
   */
  message: string;
  onAgentChange?: (agent: any, type: 'update' | 'remove') => void;
  onMessagesChange?: (messages: ChatMessage[]) => void;
  onResponseFinished?: (session: any) => void;
  onResponseStart?: (messages: ChatMessage[]) => Promise<void>;
  request?: (parameters: OpenAIRequestParameters) => Promise<Response>;
}

export const initialState: ChatState = {
  changingSystemRole: false,
  createAt: -1,
  editingMessageId: undefined,
  loading: false,
  message: '',
  messages: [],
  updateAt: -1,
};
