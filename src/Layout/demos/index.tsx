import { Layout } from '@unitalkai/ui';
import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  footer: css`
    height: 36px;
    border-block-start: 1px solid ${token.colorBorder};
  `,
  header: css`
    height: 100%;
    background: ${token.cyan5A};
    border-block-end: 1px solid ${token.colorBorder};
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
