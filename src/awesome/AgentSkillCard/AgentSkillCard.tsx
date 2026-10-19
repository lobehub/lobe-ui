'use client';

import './style.css';

import clsx from 'clsx';
import { Bot, UserRound } from 'lucide-react';
import { memo, useState } from 'react';

import { renderLandingIcon } from '@/awesome/landingIcon';
import Icon from '@/Icon';
import Segmented from '@/Segmented';
import Snippet from '@/Snippet';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { DEFAULT_SKILL_AGENTS } from './agents';
import { awesomeAgentSkillCardClasses } from './stable';
import { styles } from './style';
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
      <div
        {...styleProps(styles.root, clsx(awesomeAgentSkillCardClasses(), className))}
        {...toDataAttributes({ mode })}
        {...rest}
      >
        {human && (
          <Segmented<AgentSkillCardMode>
            block
            className={awesomeAgentSkillCardClasses('mode-switch')}
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
        <div {...styleProps(styles.panel, awesomeAgentSkillCardClasses('panel'))}>
          {mode === 'agent' && agents.length > 0 && (
            <div {...styleProps(styles.agents, awesomeAgentSkillCardClasses('agents'))}>
              {agents.map(({ avatar, title }) => (
                <span
                  key={title}
                  title={title}
                  {...styleProps(styles.agent, awesomeAgentSkillCardClasses('agent'))}
                >
                  {renderLandingIcon(avatar, AVATAR_SIZE)}
                </span>
              ))}
            </div>
          )}
          {panel.description && (
            <p {...styleProps(styles.description, awesomeAgentSkillCardClasses('description'))}>
              {panel.description}
            </p>
          )}
          <Snippet
            className={awesomeAgentSkillCardClasses('code')}
            language={'bash'}
            prefix={shell ? '$' : undefined}
            variant={'outlined'}
          >
            {panel.code}
          </Snippet>
        </div>
        {footer && (
          <div
            {...styleProps(
              styles.footer,
              clsx(awesomeAgentSkillCardClasses('footer'), 'lobe-agent-skill-card-footer'),
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);

AgentSkillCard.displayName = 'AgentSkillCard';

export default AgentSkillCard;
