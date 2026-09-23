import {
  ClaudeCode,
  Cline,
  Codex,
  Cursor,
  GeminiCLI,
  GithubCopilot,
  OpenCode,
  Windsurf,
} from '@lobehub/icons';

import type { AgentSkillCardAgent } from './type';

export const DEFAULT_SKILL_AGENTS: AgentSkillCardAgent[] = [
  { avatar: ClaudeCode.Avatar, title: 'Claude Code' },
  { avatar: Codex.Avatar, title: 'Codex' },
  { avatar: Cursor.Avatar, title: 'Cursor' },
  { avatar: GeminiCLI.Avatar, title: 'Gemini CLI' },
  { avatar: GithubCopilot.Avatar, title: 'GitHub Copilot' },
  { avatar: Windsurf.Avatar, title: 'Windsurf' },
  { avatar: Cline.Avatar, title: 'Cline' },
  { avatar: OpenCode.Avatar, title: 'OpenCode' },
];
