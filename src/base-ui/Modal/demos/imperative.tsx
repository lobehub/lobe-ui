import { Button, Flexbox, Text } from '@lobehub/ui';
import { createModalSystem, useModalContext } from '@lobehub/ui/base-ui';
import { Tag } from 'antd';
import { cssVar } from 'antd-style';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

const { ModalHost, createModal } = createModalSystem();

const TaskModalContent = () => {
  const { close } = useModalContext();

  return (
    <Flexbox gap={16}>
      <Flexbox gap={8}>
        <Text style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, textTransform: 'uppercase' }}>
          Output
        </Text>
        <div
          style={{
            background: cssVar.colorFillTertiary,
            borderRadius: 8,
            fontSize: 13,
            lineHeight: 1.7,
            padding: '10px 14px',
          }}
        >
          Summarized 3 documents · Identified 12 action items · Generated report in 4.2s
        </div>
      </Flexbox>
      <Flexbox gap={6}>
        {[
          'Fetched context from knowledge base',
          'Parsed document structure',
          'Ran summarization model',
          'Formatted output as Markdown',
        ].map((step, i) => (
          <Flexbox horizontal align="center" gap={8} key={i}>
            <CheckCircle size={14} style={{ color: cssVar.colorSuccess, flexShrink: 0 }} />
            <Text style={{ fontSize: 13 }}>{step}</Text>
          </Flexbox>
        ))}
      </Flexbox>
      <Flexbox horizontal gap={8} justify="flex-end">
        <Button icon={<XCircle size={14} />} onClick={close}>
          Dismiss
        </Button>
        <Button type="primary" onClick={close}>
          View Report
        </Button>
      </Flexbox>
    </Flexbox>
  );
};

const runTask = () => {
  const instance = createModal({
    content: <TaskModalContent />,
    title: 'AI Task · Running…',
  });
  setTimeout(() => {
    instance.update({ title: 'AI Task · Completed ✓' });
  }, 1200);
};

export default () => {
  const [running, setRunning] = useState(false);

  const handleRun = () => {
    setRunning(true);
    runTask();
    setTimeout(() => setRunning(false), 1400);
  };

  return (
    <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 560 }}>
      {/* 任务队列行，无外层卡片 */}
      <Flexbox horizontal align="center" gap={10}>
        <div
          style={{
            alignItems: 'center',
            background: running
              ? `color-mix(in srgb, ${cssVar.colorWarning} 12%, transparent)`
              : cssVar.colorFillTertiary,
            borderRadius: '50%',
            display: 'flex',
            flexShrink: 0,
            height: 32,
            justifyContent: 'center',
            transition: 'background 0.3s',
            width: 32,
          }}
        >
          {running ? (
            <Loader2
              size={15}
              style={{
                animation: 'spin 1s linear infinite',
                color: cssVar.colorWarning,
              }}
            />
          ) : (
            <span style={{ fontSize: 15 }}>🤖</span>
          )}
        </div>
        <Flexbox flex={1} gap={2}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>Summarize Documents</Text>
          <Text style={{ fontSize: 12, opacity: 0.5 }}>
            {running ? 'Running…' : 'Ready · title updates when task completes'}
          </Text>
        </Flexbox>
        <Tag>Imperative</Tag>
        <Button disabled={running} size="small" type="primary" onClick={handleRun}>
          Run
        </Button>
      </Flexbox>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <ModalHost />
    </Flexbox>
  );
};
