import { Layout } from '@lobehub/ui';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;

  background: ${({ theme }) => theme.cyan5A};
  border-bottom: 1px solid ${({ theme }) => theme.colorBorder};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 36px;

  border-top: 1px solid ${({ theme }) => theme.colorBorder};
`;

const MockData = ({ text }: { text: string }) =>
  Array.from({ length: 50 })
    .fill('')
    .map((_, index) => <div key={index}>{text}</div>);

export default () => {
  return (
    <div style={{ height: 400, overflow: 'auto' }}>
      <Layout
        footer={<Footer>FOOTER</Footer>}
        header={<Header>HEADER</Header>}
        sidebar={<MockData text="SIDEBAR" />}
        toc={'TOC'}
      >
        <MockData text="CONTENT" />
      </Layout>
    </div>
  );
};
