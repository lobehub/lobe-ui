'use client';

import { cx } from 'antd-style';
import { Bot, UserRound } from 'lucide-react';
import { memo, useState } from 'react';

import { renderLandingIcon } from '@/awesome/landingIcon';
import Segmented from '@/base-ui/Segmented';
import Icon from '@/Icon';
import Snippet from '@/Snippet';

import { DEFAULT_SKILL_AGENTS } from './agents';
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
      <div className={cx(styles.root, className)} {...rest}>
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
        <div className={styles.panel}>
          {mode === 'agent' && agents.length > 0 && (
            <div className={styles.agents}>
              {agents.map(({ avatar, title }) => (
                <span className={styles.agent} key={title} title={title}>
                  {renderLandingIcon(avatar, AVATAR_SIZE)}
                </span>
              ))}
            </div>
          )}
          {panel.description && <p className={styles.description}>{panel.description}</p>}
          <Snippet
            className={styles.code}
            language={'bash'}
            prefix={shell ? '$' : undefined}
            variant={'outlined'}
          >
            {panel.code}
          </Snippet>
        </div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  },
);

AgentSkillCard.displayName = 'AgentSkillCard';

export default AgentSkillCard;
