import { Mermaid } from '@lobehub/ui';

const flowchart = `flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
`;

export default () => {
  return <Mermaid>{flowchart}</Mermaid>;
};
