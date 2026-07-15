import { Mermaid } from '@lobehub/ui';

const pie = `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
`;

export default () => {
  return <Mermaid>{pie}</Mermaid>;
};
