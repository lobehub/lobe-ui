import { ChatMessage, InternalChatContext, OpenAIRequestParams } from '../types';

export interface ChatState extends InternalChatContext {
  /**
   * @title 消息
   * @type {string}
   */
  message: string;
  /**
   * @title 加载状态
   * @type {boolean}
   */
  loading: boolean;
  /**
   * @title 改变系统角色状态
   * @type {boolean}
   */
  changingSystemRole: boolean;
  /**
   * 编辑中的消息 id
   */
  editingMessageId?: number | null;
  onMessagesChange?: (messages: ChatMessage[]) => void;
  onResponseStart?: (messages: ChatMessage[]) => Promise<void>;
  onResponseFinished?: (session: any) => void;
  onAgentChange?: (agent: any, type: 'update' | 'remove') => void;
  request?: (params: OpenAIRequestParams) => Promise<Response>;
}

export const initialState: ChatState = {
  message: '',
  messages: [],
  loading: false,
  changingSystemRole: false,
  editingMessageId: null,
  createAt: -1,
  updateAt: -1,
};
