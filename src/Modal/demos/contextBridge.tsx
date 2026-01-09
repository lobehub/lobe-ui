import { Button, ModalStackProvider, Text, useModalStack } from '@lobehub/ui';
import { createContext, use, useState } from 'react';

// 1. 创建自定义 Context
const ThemeContext = createContext<{ color: string; name: string }>({
  color: '#000',
  name: 'default',
});

// 2. Modal 内容组件 - 使用 context
const ModalContent = () => {
  const theme = use(ThemeContext);

  return (
    <div>
      <Text as="p">
        当前主题: <strong style={{ color: theme.color }}>{theme.name}</strong>
      </Text>
      <Text as="p" style={{ color: theme.color }}>
        这段文字使用了 context 中的颜色: {theme.color}
      </Text>
    </div>
  );
};

// 3. 使用 useModalStack 的组件
const ModalTrigger = () => {
  const { createModal } = useModalStack();

  const openModal = () => {
    createModal({
      children: <ModalContent />,
      footer: null,
      title: 'Context Bridge Demo',
    });
  };

  return (
    <Button onClick={openModal} type="primary">
      Open Modal (with Context Bridge)
    </Button>
  );
};

export default () => {
  const [themeName, setThemeName] = useState<'red' | 'blue' | 'green'>('blue');

  const themes = {
    blue: { color: '#1890ff', name: 'Blue Theme' },
    green: { color: '#52c41a', name: 'Green Theme' },
    red: { color: '#ff4d4f', name: 'Red Theme' },
  };

  return (
    <ThemeContext value={themes[themeName]}>
      {/* 传入 contexts 数组，自动桥接这些 context 到 modal */}
      <ModalStackProvider contexts={[ThemeContext]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              onClick={() => setThemeName('red')}
              style={{ background: themeName === 'red' ? '#ff4d4f' : undefined }}
            >
              Red
            </Button>
            <Button
              onClick={() => setThemeName('blue')}
              style={{ background: themeName === 'blue' ? '#1890ff' : undefined }}
            >
              Blue
            </Button>
            <Button
              onClick={() => setThemeName('green')}
              style={{ background: themeName === 'green' ? '#52c41a' : undefined }}
            >
              Green
            </Button>
          </div>

          <Text as="p">
            当前选择的主题:{' '}
            <strong style={{ color: themes[themeName].color }}>{themes[themeName].name}</strong>
          </Text>

          <ModalTrigger />
        </div>
      </ModalStackProvider>
    </ThemeContext>
  );
};
