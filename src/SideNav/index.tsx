import { DivProps } from '@/types';
import { Space } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  width: 64px;
  height: 100%;
  min-height: 640px;
  padding: 16px 0;

  background: ${({ theme }) => theme.colorBgContainer};
  border-right: 1px solid ${({ theme }) => theme.colorBorder};
`;

export interface SideNavProps extends DivProps {
  /**
   * @description Avatar to be displayed at the top of the sidenav
   */
  avatar?: React.ReactNode;
  /**
   * @description Actions to be displayed below the avatar
   */
  topActions?: React.ReactNode;
  /**
   * @description Actions to be displayed at the bottom of the sidenav
   */
  bottomActions: React.ReactNode;
}

const SideNav: React.FC<SideNavProps> = ({ avatar, topActions, bottomActions, ...props }) => {
  return (
    <Layout {...props}>
      <Space size={16} direction="vertical" align="center">
        {avatar}
        <Space size={8} direction="vertical" align="center">
          {topActions}
        </Space>
      </Space>
      <Space size={4} direction="vertical" align="center">
        {bottomActions}
      </Space>
    </Layout>
  );
};

export default React.memo(SideNav);
