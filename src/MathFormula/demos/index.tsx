import { MathFormula } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

// Sample formula from the A2UI playground `Math` sample (CopilotKit, MIT).
export default () => (
  <Flexbox gap={8}>
    <MathFormula block value={String.raw`\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i`} />
    <span>
      Energy and mass: <MathFormula value="E = mc^2" />, inline with the text.
    </span>
  </Flexbox>
);
