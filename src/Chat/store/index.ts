import { create, StoreApi } from 'zustand';

import { createContext, optionalDevtools } from 'zustand-utils';

import { ChatStore, createStore } from './store';

export const createChatStore = (showDevtools = false) =>
  create<ChatStore>()(optionalDevtools(showDevtools)(createStore, { name: 'CHAT_COMPONENT' }));

export const { Provider, useStore, useStoreApi } = createContext<StoreApi<ChatStore>>();

export { messagesReducer, type MessageDispatch } from './messageReducer';
export * from './selectors';
export type { ChatStore } from './store';
