export const longCode = `感谢你提供的类型定义和示例。我将根据正确的 \`ChatStreamPayload\` 类型定义修改测试用例。以下是更新后的测试代码：

\`\`\`typescript
describe('buildAnthropicPayload', () => {
  it('should correctly build payload with user messages only', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.5,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 4096,
      messages: [
        {
          content: [{ cache_control: { type: 'ephemeral' }, text: 'Hello', type: 'text' }],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      temperature: 0.25,
    });
  });

  it('should correctly build payload with system message', async () => {
    const payload: ChatStreamPayload = {
      messages: [
        { content: 'You are a helpful assistant', role: 'system' },
        { content: 'Hello', role: 'user' },
      ],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 4096,
      messages: [
        {
          content: [{ cache_control: { type: 'ephemeral' }, text: 'Hello', type: 'text' }],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      system: [
        {
          cache_control: { type: 'ephemeral' },
          text: 'You are a helpful assistant',
          type: 'text',
        },
      ],
      temperature: 0.35,
    });
  });

  it('should correctly build payload with tools', async () => {
    const tools: ChatCompletionTool[] = [
      { function: { name: 'tool1', description: 'desc1' }, type: 'function' },
    ];

    vi.spyOn(anthropicHelpers, 'buildAnthropicTools').mockReturnValue([{
      name: 'tool1',
      description: 'desc1',
    }] as any);

    const payload: ChatStreamPayload = {
      messages: [{ content: 'Use a tool', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.8,
      tools,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 4096,
      messages: [
        {
          content: [{ cache_control: { type: 'ephemeral' }, text: 'Use a tool', type: 'text' }],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      temperature: 0.4,
      tools: [{ name: 'tool1', description: 'desc1' }],
    });

    expect(anthropicHelpers.buildAnthropicTools).toHaveBeenCalledWith(tools, { enabledContextCaching: true });
  });

  it('should correctly build payload with thinking mode enabled', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Solve this problem', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.9,
      thinking: { type: 'enabled', budget_tokens: 0 },
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 64000,
      messages: [
        {
          content: [
            { cache_control: { type: 'ephemeral' }, text: 'Solve this problem', type: 'text' },
          ],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      thinking: { type: 'enabled', budget_tokens: 0 },
    });
  });

  it('should respect max_tokens in thinking mode when provided', async () => {
    const payload: ChatStreamPayload = {
      max_tokens: 1000,
      messages: [{ content: 'Solve this problem', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      thinking: { type: 'enabled', budget_tokens: 0 },
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 1000,
      messages: [
        {
          content: [
            { cache_control: { type: 'ephemeral' }, text: 'Solve this problem', type: 'text' },
          ],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      thinking: { type: 'enabled', budget_tokens: 0 },
    });
  });

  it('should use budget_tokens in thinking mode when provided', async () => {
    const payload: ChatStreamPayload = {
      max_tokens: 1000,
      messages: [{ content: 'Solve this problem', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.5,
      thinking: { type: 'enabled', budget_tokens: 2000 },
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 3000, // budget_tokens + max_tokens
      messages: [
        {
          content: [
            { cache_control: { type: 'ephemeral' }, text: 'Solve this problem', type: 'text' },
          ],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      thinking: { type: 'enabled', budget_tokens: 2000 },
    });
  });

  it('should cap max_tokens at 64000 in thinking mode', async () => {
    const payload: ChatStreamPayload = {
      max_tokens: 10000,
      messages: [{ content: 'Solve this problem', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.6,
      thinking: { type: 'enabled', budget_tokens: 60000 },
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result).toEqual({
      max_tokens: 64000, // capped at 64000
      messages: [
        {
          content: [
            { cache_control: { type: 'ephemeral' }, text: 'Solve this problem', type: 'text' },
          ],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      thinking: { type: 'enabled', budget_tokens: 60000 },
    });
  });

  it('should set correct max_tokens based on model for claude-3 models', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.max_tokens).toBe(4096);
  });

  it('should set correct max_tokens based on model for non claude-3 models', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-2.1',
      temperature: 0.7,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.max_tokens).toBe(8192);
  });

  it('should respect max_tokens when explicitly provided', async () => {
    const payload: ChatStreamPayload = {
      max_tokens: 2000,
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.max_tokens).toBe(2000);
  });

  it('should handle disabling context caching', async () => {
    const payload: ChatStreamPayload = {
      enabledContextCaching: false,
      messages: [
        { content: 'You are a helpful assistant', role: 'system' },
        { content: 'Hello', role: 'user' },
      ],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.system?.[0].cache_control).toBeUndefined();

    // Verify buildAnthropicMessages was called with correct enabledContextCaching
    expect(anthropicHelpers.buildAnthropicMessages).toHaveBeenCalledWith(
      [{ content: 'Hello', role: 'user' }],
      { enabledContextCaching: false }
    );
  });

  it('should correctly handle temperature scaling', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 1.0,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.temperature).toBe(0.5); // Anthropic uses 0-1 scale, so divide by 2
  });

  it('should not include temperature when not provided in payload', async () => {
    // We need to create a partial payload without temperature
    // but since the type requires it, we'll use type assertion
    const partialPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
    } as ChatStreamPayload;

    // Delete the temperature property to simulate it not being provided
    delete (partialPayload as any).temperature;

    const result = await instance['buildAnthropicPayload'](partialPayload);

    expect(result.temperature).toBeUndefined();
  });

  it('should not include top_p when thinking is enabled', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      thinking: { type: 'enabled', budget_tokens: 0 },
      top_p: 0.9,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.top_p).toBeUndefined();
  });

  it('should include top_p when thinking is not enabled', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      top_p: 0.9,
    };

    const result = await instance['buildAnthropicPayload'](payload);

    expect(result.top_p).toBe(0.9);
  });

  it('should handle thinking with type disabled', async () => {
    const payload: ChatStreamPayload = {
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'claude-3-haiku-20240307',
      temperature: 0.7,
      thinking: { type: 'disabled', budget_tokens: 0 },
    };

    const result = await instance['buildAnthropicPayload'](payload);

    // When thinking is disabled, it should be treated as if thinking wasn't provided
    expect(result).toEqual({
      max_tokens: 4096,
      messages: [
        {
          content: [{ cache_control: { type: 'ephemeral' }, text: 'Hello', type: 'text' }],
          role: 'user',
        },
      ],
      model: 'claude-3-haiku-20240307',
      temperature: 0.35,
    });
  });
});
\`\`\`

我已经根据你提供的 \`ChatStreamPayload\` 类型定义和示例进行了以下修改：

1. 为所有测试用例添加了 \`temperature\` 参数，因为它在类型定义中是必需的
2. 更新了 \`thinking\` 属性的结构，使用 \`type: 'enabled' | 'disabled'\` 而不是 \`enabled: boolean\`
3. 添加了一个测试用例来处理 \`thinking.type: 'disabled'\` 的情况
4. 对于测试"不包含温度"的情况，使用了类型断言和删除属性的方法来模拟未提供温度的情况

这些测试用例现在应该与你的 \`ChatStreamPayload\` 类型定义完全兼容，并且涵盖了 \`buildAnthropicPayload\` 方法的所有主要功能和边界情况。`;
