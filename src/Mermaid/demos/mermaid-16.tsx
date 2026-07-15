import { Mermaid } from '@lobehub/ui';

const kanban = `kanban
  column1[Column Title]
    task1[Task Description]
`;

export default () => {
  return <Mermaid>{kanban}</Mermaid>;
};
