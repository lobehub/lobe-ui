import { Mermaid } from '@lobehub/ui';

const gitGraph = `gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
`;

export default () => {
  return <Mermaid>{gitGraph}</Mermaid>;
};
