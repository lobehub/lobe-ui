import { Layout } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';

import { Flexbox } from '@/Flex';

const styles = createStaticStyles(({ css, cssVar }) => ({
  footer: css`
    height: 36px;
    border-block-start: 1px solid ${cssVar.colorBorder};
  `,
  header: css`
    height: 100%;
    border-block-end: 1px solid ${cssVar.colorBorder};
    background: ${cssVar.cyan};
  `,
}));

const MockData = ({ text }: { text: string }) =>
  Array.from({ length: 50 })
    .fill('')
    .map((_, index) => <div key={index}>{text}</div>);

export default () => {
  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      <Layout
        sidebar={<MockData text="SIDEBAR" />}
        toc={'TOC'}
        footer={
          <Flexbox align={'center'} className={styles.footer} justify={'center'}>
            FOOTER
          </Flexbox>
        }
        header={
          <Flexbox align={'center'} className={styles.header} justify={'center'}>
            HEADER
          </Flexbox>
        }
      >
        <MockData text="CONTENT" />
      </Layout>
    </div>
  );
};
