import { MathFormula } from '@lobehub/ui';

import { Flexbox } from '@/Flex';

// Sample formula from the A2UI playground `Math` sample (CopilotKit, MIT).
export default () => (
  <Flexbox gap={8}>
    <MathFormula
      block
      value={String.raw`\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i`}
      variant="a2ui"
    />
    <span>
      Energy and mass: <MathFormula value="E = mc^2" variant="a2ui" />, inline with the text.
    </span>
  </Flexbox>
);
