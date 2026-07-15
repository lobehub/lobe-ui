import { Mermaid } from '@lobehub/ui';

const sequenceDiagram = `sequenceDiagram
    autonumber
    Alice->>John: Hello John, how are you?
    loop HealthCheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
`;

export default () => {
  return <Mermaid>{sequenceDiagram}</Mermaid>;
};
