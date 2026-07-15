import { Mermaid } from '@lobehub/ui';

const stateDiagram = `stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
 `;

export default () => {
  return <Mermaid>{stateDiagram}</Mermaid>;
};
