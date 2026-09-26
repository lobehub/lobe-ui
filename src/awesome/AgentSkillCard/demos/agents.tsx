import { Kiro, Qoder, Trae } from '@lobehub/icons';
import { AgentSkillCard } from '@lobehub/ui/awesome';

export default () => (
  <AgentSkillCard
    style={{ marginInline: 'auto' }}
    agent={{
      code: 'Read https://example.com/llms.txt before writing code.',
      description: 'Point your agent at the docs index',
    }}
    agents={[
      { avatar: Kiro.Avatar, title: 'Kiro' },
      { avatar: Qoder.Avatar, title: 'Qoder' },
      { avatar: Trae.Avatar, title: 'Trae' },
    ]}
    footer={
      <>
        <a href="/skills.md">skills.md</a>
        <a href="/llms.txt">llms.txt</a>
      </>
    }
  />
);
