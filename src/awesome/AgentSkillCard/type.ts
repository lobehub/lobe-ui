import type { ElementType, ReactNode } from 'react';

import type { DivProps } from '@/types';

export type AgentSkillCardMode = 'agent' | 'human';

export interface AgentSkillCardAgent {
  /** An avatar component such as `ClaudeCode.Avatar` from `@lobehub/icons`, or a ready-made node. */
  avatar: ElementType<{ size: number }> | ReactNode;
  title: string;
}

export interface AgentSkillCardPanel {
  /** The text users copy: a prompt for agents, a shell command for humans. */
  code: string;
  /** One-line instruction above the code block. */
  description?: ReactNode;
  /** Tab label. Defaults to "I'm an Agent" / "I'm a Human". */
  label?: ReactNode;
  /** Renders the code with a `$` shell prompt. Defaults to true for the human panel. */
  shell?: boolean;
}

export interface AgentSkillCardProps extends DivProps {
  /** Shown when the agent tab is active. */
  agent: AgentSkillCardPanel;
  /**
   * Coding agents shown above the prompt. Pass an empty array to hide the row.
   * @default DEFAULT_SKILL_AGENTS
   */
  agents?: AgentSkillCardAgent[];
  /** @default 'agent' */
  defaultMode?: AgentSkillCardMode;
  /** Extra content at the bottom of the card, e.g. links to skills.md and llms.txt. */
  footer?: ReactNode;
  /** Shown when the human tab is active. Without it the card has no tabs. */
  human?: AgentSkillCardPanel;
  mode?: AgentSkillCardMode;
  onModeChange?: (mode: AgentSkillCardMode) => void;
}
