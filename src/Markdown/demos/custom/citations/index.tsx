import { Block, Markdown, SearchResultCards, Tabs } from '@lobehub/ui';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { normalizeThinkTags, remarkCaptureThink } from '../thinking/remarkPlugin';
import { cases } from './cases';

export default () => {
  const [current, setCurrent] = useState('general');

  // @ts-ignore
  const state = cases[current];

  return (
    <Flexbox gap={16} padding={16}>
      <Tabs
        activeKey={current}
        compact
        items={[
          { key: 'general', label: '普通case' },
          { key: 'withThinking', label: '带 thinking' },
          { key: 'inCode', label: '代码块' },
        ]}
        onChange={(key) => {
          setCurrent(key);
        }}
      />
      {state.citations && (
        <div className={'citations'} style={{ marginBottom: 12 }}>
          <SearchResultCards
            dataSource={state.citations.map((item: string) => ({ title: item, url: item }))}
          />
        </div>
      )}
      <Markdown
        citations={state.citations}
        components={{
          think: (props: any) => (
            <Block padding={16} style={{ marginBottom: 20 }}>
              <Markdown variant={'chat'} {...props} citations={state.citations} />
            </Block>
          ),
        }}
        enableCustomFootnotes
        remarkPlugins={[remarkCaptureThink]}
        variant={'chat'}
      >
        {normalizeThinkTags(state.markdown)}
      </Markdown>
    </Flexbox>
  );
};
