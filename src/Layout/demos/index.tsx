import { Layout } from '@lobehub/ui';
import { createStyles } from 'antd-style';

import { Flexbox } from '@/Flex';

const useStyles = createStyles(({ css, token }) => ({
  footer: css`
    height: 36px;
    border-block-start: 1px solid ${token.colorBorder};
  `,
  header: css`
    height: 100%;
    border-block-end: 1px solid ${token.colorBorder};
    background: ${token.cyan5A};
  `,
}));

const MockData = ({ text }: { text: string }) =>
  Array.from({ length: 50 })
    .fill('')
    .map((_, index) => <div key={index}>{text}</div>);

export default () => {
  const { styles } = useStyles();
  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      <Layout
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
        sidebar={<MockData text="SIDEBAR" />}
        toc={'TOC'}
      >
        <MockData text="CONTENT" />
      </Layout>
    </div>
  );
};
