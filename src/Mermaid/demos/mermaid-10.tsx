import { Mermaid } from '@lobehub/ui';

const requirementDiagram = `requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req
`;

export default () => {
  return <Mermaid>{requirementDiagram}</Mermaid>;
};
