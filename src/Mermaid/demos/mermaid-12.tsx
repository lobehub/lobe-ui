import { Mermaid } from '@lobehub/ui';

const mindmap = `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
`;

export default () => {
  return <Mermaid>{mindmap}</Mermaid>;
};
