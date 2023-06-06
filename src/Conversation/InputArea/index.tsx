import { SendOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import { memo, useRef } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { chatSelectors, useStore, useStoreApi } from '../../Chat/store';
import ActionBar from './ActionBar';

const useStyles = createStyles(({ css, responsive, token }) => ({
  container: css`
    position: sticky;
    z-index: ${token.zIndexPopupBase};
    bottom: 0;

    padding-top: 12px;
    padding-bottom: 24px;

    background-image: linear-gradient(to top, ${token.colorBgLayout} 88%, transparent 100%);

    ${responsive.mobile} {
      width: 100%;
    }
  `,
  boxShadow: css`
    position: relative;
    border-radius: 8px;
    box-shadow: ${token.boxShadowSecondary};
  `,
  input: css`
    width: 100%;
    border-radius: 8px;
  `,
  btn: css`
    position: absolute;
    z-index: 10;
    right: 8px;
    bottom: 8px;

    color: ${token.colorTextTertiary};

    &:hover {
      color: ${token.colorTextSecondary};
    }
  `,
  extra: css`
    color: ${token.colorTextTertiary};
  `,
}));

export const InputArea = ({}) => {
  const [message, sendMessage, isLoading, disabled] = useStore(
    (s) => [s.message, s.sendMessage, s.loading, chatSelectors.disableInput(s)],
    shallow,
  );
  const isChineseInput = useRef(false);

  const { styles, theme } = useStyles();
  const { mobile } = useResponsive();

  const storeApi = useStoreApi();

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          fontSize: 16,
          colorBgContainer: theme.colorBgElevated,
          controlHeightLG: 48,
          colorBorder: 'transparent',
          colorPrimaryHover: 'transparent',
        },
      }}
    >
      <Flexbox className={styles.container} gap={8}>
        <ActionBar />
        <Flexbox align={'center'} className={styles.boxShadow} gap={8} horizontal>
          <Input.TextArea
            autoSize={{ maxRows: 8 }}
            className={styles.input}
            disabled={disabled}
            onChange={(e) => {
              storeApi.setState({ message: e.target.value });
            }}
            onCompositionEnd={() => {
              isChineseInput.current = false;
            }}
            onCompositionStart={() => {
              isChineseInput.current = true;
            }}
            onPressEnter={(e) => {
              if (!isLoading && !e.shiftKey && !isChineseInput.current) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="请输入内容..."
            size={'large'}
            value={message}
          />
          {mobile ? null : (
            <Button
              className={styles.btn}
              disabled={disabled}
              icon={<SendOutlined />}
              loading={isLoading}
              onClick={sendMessage}
              type="text"
            />
          )}
        </Flexbox>
      </Flexbox>
    </ConfigProvider>
  );
};

export default memo(InputArea);
