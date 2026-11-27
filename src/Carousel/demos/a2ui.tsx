import { Carousel, cssVar } from '@lobehub/ui';
import { Fragment } from 'react';

// Sample data from the A2UI standard `Carousel` (CopilotKit Gen UI, MIT). A fragment is one slide.
const slides = [
  ['Faster deploys', 'Builds start in under ten seconds.'],
  ['Audit log', 'Every change, who made it and when.'],
  ['Usage alerts', 'A heads-up before you reach a limit.'],
];

export default () => (
  <Carousel aria-label="Release highlights" variant="a2ui">
    {slides.map(([title, caption]) => (
      <Fragment key={title}>
        <span>{title}</span>
        <span style={{ color: cssVar.colorTextSecondary, fontSize: '0.875em' }}>{caption}</span>
      </Fragment>
    ))}
  </Carousel>
);
