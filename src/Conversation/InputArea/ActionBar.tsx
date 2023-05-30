import { ConfigProvider, Popconfirm, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { EraserIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import IconAction from '@/ActionIcon';

import { chatSelectors, useStore } from '../../Chat/store';

const useStyles = createStyles(({ css, token }) => ({
  extra: css`
    color: ${token.colorTextTertiary};
  `,
}));

export const ActionBar = () => {
  const [totalToken, agentToken, messagesToken, dispatchMessage] = useStore(
    (s) => [
      chatSelectors.totalTokenCount(s),
      chatSelectors.agentTokenCount(s),
      chatSelectors.messagesTokenCount(s),
      s.dispatchMessage,
    ],
    shallow,
  );

  const { styles, theme } = useStyles();

  return totalToken > 0 ? (
    <ConfigProvider theme={{ token: { colorText: theme.colorTextSecondary } }}>
      <Flexbox
        align={'center'}
        className={styles.extra}
        direction={'horizontal-reverse'}
        gap={8}
        paddingInline={12}
      >
        <Popconfirm
          okButtonProps={{ danger: true }}
          okText={'清空会话'}
          onConfirm={() => {
            dispatchMessage({ type: 'resetMessages' });
          }}
          title={'你即将要清空会话，清空后将无法找回。是否清空当前会话？'}
        >
          <IconAction icon={EraserIcon as any} size={'small'} title={'清空当前会话'} />
        </Popconfirm>
        <Tooltip
          title={[
            agentToken > 0 ? `角色定义: ${agentToken}` : null,
            messagesToken > 0 ? `会话: ${messagesToken}` : null,
          ]
            .filter(Boolean)
            .join('  |  ')}
        >
          <Flexbox gap={4}> Tokens: {totalToken}</Flexbox>
        </Tooltip>
      </Flexbox>
    </ConfigProvider>
  ) : null;
};

export default memo(ActionBar);
