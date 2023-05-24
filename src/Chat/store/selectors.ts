import { get_encoding } from '@dqbd/tiktoken';
import type { ChatStore } from './store';

const tiktoken = get_encoding('cl100k_base');

const encode = (text: string) => {
  const tokens = tiktoken.encode(text);
  tiktoken.free();
  console.log(tokens);
  return tokens as unknown as number[];
};

const disableInputSel = (s: ChatStore) => s.changingSystemRole;

export const systemRoleSel = (s: ChatStore) => s.messages?.find((s) => s.role === 'system');

export const agentContentSel = (s: ChatStore) => s.agent.content;
export const agentTitleSel = (s: ChatStore) => s.agent.title;

const messagesTokens = (s: ChatStore): number[] =>
  encode(s.messages.map((m) => m.content).join(''));

const agentContentTokens = (s: ChatStore): number[] => encode(s.agent.content);

const totalTokens = (s: ChatStore): number[] =>
  encode([s.agent.content, ...s.messages.map((m) => m.content)].join(''));

const totalTokenCount = (s: ChatStore) => totalTokens(s).length;
const agentTokenCount = (s: ChatStore) => agentContentTokens(s).length;
const messagesTokenCount = (s: ChatStore) => messagesTokens(s).length;

export const chatSelectors = {
  totalTokenCount,
  agentTokenCount,
  messagesTokenCount,

  totalTokens,
  agentContentTokens,
  messagesTokens,
  disableInput: disableInputSel,
};
