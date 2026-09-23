import { fireEvent, render as baseRender, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';

import ConfigProvider from '@/ConfigProvider';

import AgentSkillCard from './AgentSkillCard';

const render = (ui: ReactElement) =>
  baseRender(<ConfigProvider motion={motion}>{ui}</ConfigProvider>);

const agent = { code: 'Read https://example.com/skills.md', description: 'Send this prompt' };
const human = { code: 'npx skills add example/kit', description: 'Install the skills' };

it('shows the agent prompt with the default agent logos, then the human command', () => {
  render(<AgentSkillCard agent={agent} human={human} />);

  expect(screen.getByText(agent.code)).toBeTruthy();
  expect(screen.getAllByTitle('Claude Code').length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: /I'm a Human/ }));

  expect(screen.getByText(/\$\s*npx skills add example\/kit/)).toBeTruthy();
  expect(screen.getByText('Install the skills')).toBeTruthy();
  expect(screen.queryAllByTitle('Claude Code')).toHaveLength(0);
});

it('renders only the prompt without tabs when no human panel is given', () => {
  render(<AgentSkillCard agent={agent} agents={[]} />);

  expect(screen.queryByRole('button', { name: /I'm a Human/ })).toBeNull();
  expect(screen.queryAllByTitle('Claude Code')).toHaveLength(0);
  expect(screen.getByText(agent.code)).toBeTruthy();
});

it('accepts avatar components and ready-made nodes', () => {
  const Avatar = ({ size }: { size: number }) => <i data-size={size}>A</i>;
  render(
    <AgentSkillCard
      agent={agent}
      agents={[
        { avatar: Avatar, title: 'Component' },
        { avatar: <b>N</b>, title: 'Node' },
      ]}
    />,
  );

  expect(screen.getByTitle('Component').querySelector('i')?.getAttribute('data-size')).toBe('28');
  expect(screen.getByTitle('Node').textContent).toBe('N');
});
