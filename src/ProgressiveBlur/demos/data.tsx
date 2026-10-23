import { cssVar, Flexbox, Tag } from '@lobehub/ui';
import type { CSSProperties } from 'react';

export const frameStyle: CSSProperties = {
  background: cssVar.colorBgLayout,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 12,
  height: 320,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
};

export const scrollStyle: CSSProperties = {
  height: '100%',
  overflow: 'auto',
};

const sections = [
  {
    tags: ['Goal', 'Q3'],
    text: 'Weekly active users grew 18% after the onboarding checklist shipped, beating the 12% target set at kickoff.',
    title: 'Summary',
  },
  {
    tags: ['Activation'],
    text: 'Day-one activation rose from 41% to 52%. Most of the lift came from the guided first task and the template gallery.',
    title: 'Activation',
  },
  {
    tags: ['Retention', 'Risk'],
    text: 'Week-four retention is flat at 33%. Users who skip the checklist churn twice as often, so the next milestone targets them.',
    title: 'Retention',
  },
  {
    tags: ['Revenue'],
    text: 'Paid conversion moved from 3.1% to 3.6%, with annual plans now 44% of new subscriptions.',
    title: 'Revenue',
  },
  {
    tags: ['Next'],
    text: 'Ship contextual tips for skipped steps, add an email nudge on day three and re-run the cohort analysis in two weeks.',
    title: 'Next steps',
  },
];

export const Report = () => (
  <Flexbox gap={20} padding={20}>
    {sections.map((section) => (
      <Flexbox gap={8} key={section.title}>
        <Flexbox horizontal align={'center'} gap={8}>
          <strong>{section.title}</strong>
          {section.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Flexbox>
        <div style={{ color: cssVar.colorTextSecondary, lineHeight: 1.6 }}>{section.text}</div>
      </Flexbox>
    ))}
  </Flexbox>
);

export const Strip = () => (
  <Flexbox horizontal gap={12} padding={16} style={{ width: 'max-content' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <Flexbox
        align={'center'}
        justify={'center'}
        key={i}
        style={{
          background: cssVar.colorFillSecondary,
          borderRadius: 8,
          height: 96,
          width: 120,
        }}
      >
        Card {i + 1}
      </Flexbox>
    ))}
  </Flexbox>
);
