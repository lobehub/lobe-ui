import { get_encoding } from '@dqbd/tiktoken';
import type { ChatStore } from './store';

const tiktoken = get_encoding('cl100k_base');

const encode = (text: string) => {
  if (!text) return [];

  const tokens = tiktoken.encode(text);

  return tokens as unknown as number[];
};

const disableInputSel = (s: ChatStore) => s.changingSystemRole;

const messagesTokens = (s: ChatStore): number[] =>
  encode(s.messages.map((m) => m.content).join(''));

const agentContentTokens = (s: ChatStore): number[] =>
  encode(
    s.messages
      .filter((s) => s.role === 'system')
      .map((c) => c.content)
      .join('') || '',
  );

const totalTokens = (s: ChatStore): number[] => encode(s.messages.map((m) => m.content).join(''));

const totalTokenCount = (s: ChatStore) => totalTokens(s).length;
const agentTokenCount = (s: ChatStore) => agentContentTokens(s).length;
const messagesTokenCount = (s: ChatStore) => messagesTokens(s).length;

export const chatSelectors = {
  totalTokenCount,
  agentTokenCount,
  messagesTokenCount,

  totalTokens,
  messagesTokens,
  disableInput: disableInputSel,
};
