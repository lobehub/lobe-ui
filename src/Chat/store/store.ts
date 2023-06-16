import { StateCreator } from 'zustand/vanilla';

import { LOADING_FLAT } from '../const';
import { ChatMessage } from '../types';
import { FetchSSEOptions, fetchSSE } from '../utils/fetch';
import { ChatState, initialState } from './initialState';
import { MessageDispatch, messagesReducer } from './messageReducer';

interface ChatAction {
  /**
   * @title 派发消息
   * @param payload - 消息分发
   * @returns void
   */
  dispatchMessage: (payload: MessageDispatch) => void;
  generateMessage: (
    message: string,
    messages: ChatMessage[],
    options: FetchSSEOptions,
  ) => Promise<void>;

  /**
   * @title 处理消息编辑
   * @param index - 消息索引或空
   * @returns void
   */
  handleMessageEditing: (index?: number | undefined) => void;

  /**
   * @title 重发消息
   * @param index - 消息索引
   * @returns Promise<void>
   */
  resendMessage: (index: number) => Promise<void>;
  /**
   * @title 发送消息
   * @returns Promise<void>
   */
  sendMessage: () => Promise<void>;
}

export type ChatStore = ChatAction & ChatState;

export const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (set, get) => ({
  ...initialState,

  dispatchMessage: (payload) => {
    const { type, ...res } = payload;

    const messages = messagesReducer(get().messages, payload);

    set({ messages }, false, {
      payload: res,
      type: `dispatchMessage/${type}`,
    });

    get().onMessagesChange?.(messages);
  },

  generateMessage: async (message, messages, options) => {
    const { onResponseStart, request, onResponseFinished } = get();

    if (!request) return;

    await onResponseStart?.(get().messages);
    set({ loading: true });

    const fetcher = () => request({ messages });

    await fetchSSE(fetcher, options);

    set({ loading: false });

    onResponseFinished?.({ messages: get().messages });
  },

  handleMessageEditing: (index) => {
    set({ editingMessageId: index });
  },

  resendMessage: async (index) => {
    const { dispatchMessage, sendMessage, generateMessage, messages } = get();
    const lastMessage = messages.at(-1);

    // 用户通过手动删除，造成了他的问题是最后一条消息
    // 这种情况下，相当于用户重新发送消息
    if (messages.length === index && lastMessage?.role === 'user') {
      dispatchMessage({ index: index - 1, type: 'deleteMessage' });
      set({ message: lastMessage.content });
      await sendMessage();

      return;
    }

    // 上下文消息就是当前消息之前的消息
    const contextMessages = get().messages.slice(0, index);

    // 上下文消息中最后一条消息
    const userMessage = contextMessages.at(-1)?.content;

    if (!userMessage) return;

    const targetMessage = messages[index];

    // 如果不是 assistant 的消息，那么需要额外插入一条消息
    if (targetMessage.role === 'assistant') {
      const botPreviousMessage = targetMessage.content;

      // 保存之前的消息为历史消息
      dispatchMessage({ index, message: botPreviousMessage, type: 'updateMessageChoice' });
      dispatchMessage({ index, message: LOADING_FLAT, type: 'updateMessage' });
    } else {
      dispatchMessage({
        index,
        message: { content: LOADING_FLAT, role: 'assistant' },
        type: 'insertMessage',
      });
    }

    // 重置错误信息
    dispatchMessage({ error: undefined, index, type: 'setErrorMessage' });

    // 开始更新消息
    let currentResponse: string[] = [];

    await generateMessage(userMessage, contextMessages, {
      onErrorHandle: (error) => {
        dispatchMessage({ error, index, type: 'setErrorMessage' });
      },
      onMessageHandle: (text) => {
        currentResponse = [...currentResponse, text];
        dispatchMessage({ index, message: currentResponse.join(''), type: 'updateMessage' });
      },
    });
  },

  sendMessage: async () => {
    const { message, dispatchMessage, generateMessage, messages } = get();

    if (!message) return;

    set({ message: '' });
    dispatchMessage({ message, type: 'addUserMessage' });

    // 添加一个空的信息用于放置 ai 响应
    dispatchMessage({ message: { content: LOADING_FLAT, role: 'assistant' }, type: 'addMessage' });

    let currentResponse: string[] = [];

    // 生成 messages
    await generateMessage(message, messages, {
      onErrorHandle: (error) => {
        dispatchMessage({ error, index: get().messages.length - 1, type: 'setErrorMessage' });
      },
      onMessageHandle: (text) => {
        currentResponse = [...currentResponse, text];

        dispatchMessage({ responseStream: currentResponse, type: 'updateLatestBotMessage' });

        // 滚动到最后一条消息
        const item = document.querySelector('#for-loading');

        if (!item) return;

        item.scrollIntoView({ behavior: 'smooth' });
      },
    });
  },
});
