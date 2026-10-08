'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import { Bot, UserRound } from 'lucide-react';
import { memo, useState } from 'react';

import { renderLandingIcon } from '@/awesome/landingIcon';
import Icon from '@/Icon';
import Segmented from '@/Segmented';
import Snippet from '@/Snippet';
import { styleProps } from '@/styles/stylex/props';

import { DEFAULT_SKILL_AGENTS } from './agents';
import { childStyles, styles } from './style';
import type { AgentSkillCardMode, AgentSkillCardProps } from './type';

const AVATAR_SIZE = 28;

const AgentSkillCard = memo<AgentSkillCardProps>(
  ({
    agent,
    agents = DEFAULT_SKILL_AGENTS,
    className,
    defaultMode = 'agent',
    footer,
    human,
    mode: controlledMode,
    onModeChange,
    ...rest
  }) => {
    const [innerMode, setInnerMode] = useState<AgentSkillCardMode>(defaultMode);
    const mode = human ? (controlledMode ?? innerMode) : 'agent';
    const panel = mode === 'human' && human ? human : agent;
    const shell = panel.shell ?? mode === 'human';

    return (
      <div {...styleProps(styles.root, className)} {...rest}>
        {human && (
          <Segmented<AgentSkillCardMode>
            block
            size={'large'}
            value={mode}
            variant={'outlined'}
            options={[
              {
                icon: <Icon icon={Bot} size={16} />,
                label: agent.label ?? "I'm an Agent",
                value: 'agent',
              },
              {
                icon: <Icon icon={UserRound} size={16} />,
                label: human.label ?? "I'm a Human",
                value: 'human',
              },
            ]}
            onChange={(next) => {
              setInnerMode(next);
              onModeChange?.(next);
            }}
          />
        )}
        <div {...stylex.props(styles.panel)}>
          {mode === 'agent' && agents.length > 0 && (
            <div {...stylex.props(styles.agents)}>
              {agents.map(({ avatar, title }) => (
                <span key={title} title={title} {...stylex.props(styles.agent)}>
                  {renderLandingIcon(avatar, AVATAR_SIZE)}
                </span>
              ))}
            </div>
          )}
          {panel.description && <p {...stylex.props(styles.description)}>{panel.description}</p>}
          <Snippet
            language={'bash'}
            prefix={shell ? '$' : undefined}
            style={childStyles.code}
            variant={'outlined'}
          >
            {panel.code}
          </Snippet>
        </div>
        {footer && (
          <div {...styleProps(styles.footer, 'lobe-agent-skill-card-footer')}>{footer}</div>
        )}
      </div>
    );
  },
);

AgentSkillCard.displayName = 'AgentSkillCard';

export default AgentSkillCard;
