import { describe, expect, it } from 'vitest';

import type { LLMMessage } from '@/chat/types';

import { messagesReducer } from './messageReducer';

const initial = (): LLMMessage[] => [
  { content: 'system prompt', role: 'system' },
  { content: 'hello', role: 'user' },
  { content: 'hi', role: 'assistant' },
];

describe('messagesReducer', () => {
  it('inserts a message at the index without mutating state', () => {
    const state = initial();
    const next = messagesReducer(state, {
      index: 1,
      message: { content: 'inserted', role: 'user' },
      type: 'insertMessage',
    });
    expect(next.map((m) => m.content)).toEqual(['system prompt', 'inserted', 'hello', 'hi']);
    expect(state).toEqual(initial());
  });

  it('updates one message content and keeps the others by reference', () => {
    const state = initial();
    const next = messagesReducer(state, { index: 1, message: 'changed', type: 'updateMessage' });
    expect(next[1]).toEqual({ content: 'changed', role: 'user' });
    expect(state[1].content).toBe('hello');
    expect(next[0]).toBe(state[0]);
    expect(next[2]).toBe(state[2]);
  });

  it('updates one message role without mutating state', () => {
    const state = initial();
    const next = messagesReducer(state, { index: 2, role: 'user', type: 'updateMessageRole' });
    expect(next[2].role).toBe('user');
    expect(state[2].role).toBe('assistant');
  });

  it('appends a user message', () => {
    const state = initial();
    const next = messagesReducer(state, { message: 'again', type: 'addUserMessage' });
    expect(next.at(-1)).toEqual({ content: 'again', role: 'user' });
    expect(state).toHaveLength(3);
  });

  it('replaces the latest message with the joined bot stream', () => {
    const state = initial();
    const next = messagesReducer(state, {
      responseStream: ['par', 'tial'],
      type: 'updateLatestBotMessage',
    });
    expect(next).toHaveLength(3);
    expect(next[2]).toEqual({ content: 'partial', role: 'assistant' });
  });

  it('sets an error on one message without mutating state', () => {
    const state = initial();
    const error = { message: 'boom', type: 'error' } as never;
    const next = messagesReducer(state, { error, index: 2, type: 'setErrorMessage' });
    expect((next[2] as LLMMessage & { error?: unknown }).error).toBe(error);
    expect('error' in state[2]).toBe(false);
  });
});
