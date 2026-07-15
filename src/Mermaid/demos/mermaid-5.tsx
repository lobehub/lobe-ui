import { Mermaid } from '@lobehub/ui';

const erDiagram = `
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
`;

export default () => {
  return <Mermaid>{erDiagram}</Mermaid>;
};
