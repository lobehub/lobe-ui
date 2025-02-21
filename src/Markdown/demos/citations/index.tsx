import { Markdown, SearchResultCards } from '@lobehub/ui';
import { Divider, Radio } from 'antd';
import { useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { normalizeThinkTags, remarkCaptureThink } from '../thinking/remarkPlugin';
import { cases } from './cases';

export default () => {
  const [current, setCurrent] = useState('general');

  // @ts-ignore
  const state = cases[current];

  return (
    <>
      <Radio.Group
        onChange={(e) => {
          setCurrent(e.target.value);
        }}
        options={[
          { label: '普通case', value: 'general' },
          { label: '带 thinking', value: 'withThinking' },
        ]}
        value={current}
      />
      <Divider />
      <div className={'citations'} style={{ marginBottom: 12 }}>
        <SearchResultCards
          dataSource={state.citations.map((item: string) => ({ title: item, url: item }))}
        />
      </div>
      <Markdown
        citations={state.citations}
        components={{
          think: (props: any) => (
            <Flexbox style={{ marginBottom: 20 }}>
              <Markdown {...props} citations={state.citations} />
              <Divider />
            </Flexbox>
          ),
        }}
        enableCustomFootnotes
        remarkPlugins={[remarkCaptureThink]}
        variant={'chat'}
      >
        {normalizeThinkTags(state.markdown)}
      </Markdown>
    </>
  );
};
