import type { ChatMessageError, LLMMessage, LLMRoleType } from '@/chat/types';

export type MessageDispatch =
  | { message: LLMMessage; type: 'addMessage' }
  | { index: number; message: LLMMessage; type: 'insertMessage' }
  | { index: number; type: 'deleteMessage' }
  | { type: 'resetMessages' }
  | { index: number; message: string; type: 'updateMessage' }
  | { index: number; role: LLMRoleType; type: 'updateMessageRole' }
  //
  | { message: string; type: 'addUserMessage' }
  | { responseStream: string[]; type: 'updateLatestBotMessage' }
  | { index: number; message: string; type: 'updateMessageChoice' }
  | {
      error: ChatMessageError | undefined;
      index: number;
      type: 'setErrorMessage';
    };

export const messagesReducer = (state: LLMMessage[], payload: MessageDispatch): LLMMessage[] => {
  switch (payload.type) {
    case 'addMessage': {
      return [...state, payload.message];
    }

    case 'insertMessage': {
      return [...state.slice(0, payload.index), payload.message, ...state.slice(payload.index)];
    }

    case 'deleteMessage': {
      return state.filter((_, index) => index !== payload.index);
    }
    case 'resetMessages': {
      return [];
    }

    case 'updateMessage': {
      const { index, message } = payload;
      return state.map((item, i) => (i === index ? { ...item, content: message } : item));
    }
    case 'updateMessageRole': {
      const { index, role } = payload;
      return state.map((item, i) => (i === index ? { ...item, role } : item));
    }

    case 'addUserMessage': {
      return [...state, { content: payload.message, role: 'user' }];
    }

    case 'updateLatestBotMessage': {
      const newMessage: LLMMessage = {
        content: payload.responseStream.join(''),
        role: 'assistant',
      };
      return [...state.slice(0, -1), newMessage];
    }

    case 'setErrorMessage': {
      const { index, error } = payload;
      return state.map((item, i) => (i === index ? ({ ...item, error } as LLMMessage) : item));
    }

    default: {
      throw new Error('暂未实现的 type，请检查 reducer');
    }
  }
};
