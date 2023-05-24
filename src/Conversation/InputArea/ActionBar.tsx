import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import IconAction from '@/ActionIcon';
import { ConfigProvider, Popconfirm, Tooltip } from 'antd';
import { EraserIcon } from 'lucide-react';
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
        direction={'horizontal-reverse'}
        paddingInline={12}
        className={styles.extra}
        gap={8}
      >
        <Popconfirm
          title={'你即将要清空会话，清空后将无法找回。是否清空当前会话？'}
          okButtonProps={{ danger: true }}
          okText={'清空会话'}
          onConfirm={() => {
            dispatchMessage({ type: 'resetMessages' });
          }}
        >
          <IconAction title={'清空当前会话'} size={'small'} icon={EraserIcon as any} />
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
