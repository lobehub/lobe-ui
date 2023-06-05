import { produce } from 'immer';

import { ChatMessage, ChatMessageError, MessageRoleType } from '../types';

export type MessageDispatch =
  | { message: ChatMessage; type: 'addMessage' }
  | { index: number; message: ChatMessage; type: 'insertMessage' }
  | { index: number; type: 'deleteMessage' }
  | { type: 'resetMessages' }
  | { index: number; message: string; type: 'updateMessage' }
  | { index: number; role: MessageRoleType; type: 'updateMessageRole' }
  //
  | { message: string; type: 'addUserMessage' }
  | { responseStream: string[]; type: 'updateLatestBotMessage' }
  | { index: number; message: string; type: 'updateMessageChoice' }
  | {
      error: ChatMessageError | undefined;
      index: number;
      type: 'setErrorMessage';
    };

export const messagesReducer = (state: ChatMessage[], payload: MessageDispatch): ChatMessage[] => {
  switch (payload.type) {
    case 'addMessage':
      return [...state, payload.message];

    case 'insertMessage':
      return produce(state, (draftState) => {
        draftState.splice(payload.index, 0, payload.message);
      });

    case 'deleteMessage':
      return state.filter((_, i) => i !== payload.index);
    case 'resetMessages':
      return [];

    case 'updateMessage':
      return produce(state, (draftState) => {
        const { index, message } = payload;

        draftState[index].content = message;
      });
    case 'updateMessageRole':
      return produce(state, (draftState) => {
        const { index, role } = payload;

        draftState[index].role = role;
      });

    case 'addUserMessage':
      return produce(state, (draftState) => {
        draftState.push({ role: 'user', content: payload.message });
      });

    case 'updateLatestBotMessage':
      return produce(state, () => {
        const { responseStream } = payload;
        const newMessage = { role: 'assistant', content: responseStream.join('') };

        return [...state.slice(0, -1), newMessage];
      });

    case 'setErrorMessage':
      return produce(state, (draftState) => {
        const { index, error } = payload;

        draftState[index].error = error;
      });

    case 'updateMessageChoice':
      return produce(state, (draftState) => {
        const { index, message } = payload;

        const botMessage = draftState[index];
        const prevMsg = botMessage.content;

        botMessage.content = message;

        if (botMessage.choices) {
          botMessage.choices.push(prevMsg);
        } else {
          botMessage.choices = [prevMsg];
        }
      });

    default:
      throw Error('暂未实现的 type，请检查 reducer');
  }
};
