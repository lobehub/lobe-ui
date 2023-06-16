import { ActionIcon, TabsNav } from '@lobehub/ui';
import { type IPreviewerProps, openCodeSandbox, openStackBlitz, useIntl } from 'dumi';
import SourceCode from 'dumi/theme/builtins/SourceCode';
import { Code, Code2, Codesandbox, MonitorUp, Zap } from 'lucide-react';
import { type FC, type ReactNode, useState } from 'react';

import { useStyles } from './style';

const SIZE = { blockSize: 24, fontSize: 16, strokeWidth: 2 };

export interface IPreviewerActionsProps extends IPreviewerProps {
  demoContainer: HTMLDivElement | HTMLIFrameElement;
  /**
   * disabled actions
   */
  disabledActions?: ('CSB' | 'STACKBLITZ' | 'EXTERNAL' | 'HTML2SKETCH')[];
  extra?: ReactNode;
  forceShowCode?: boolean;
}

const PreviewerActions: FC<IPreviewerActionsProps> = (props) => {
  const intl = useIntl();
  const files = Object.entries(props.asset.dependencies).filter(([, { type }]) => type === 'FILE');
  const [activeKey, setActiveKey] = useState(0);
  const [showCode, setShowCode] = useState(props.forceShowCode || props.defaultShowCode);
  const isSingleFile = files.length === 1;
  const lang = (files[activeKey][0].match(/\.([^.]+)$/)?.[1] || 'text') as any;
  const { styles } = useStyles();

  return (
    <>
      <div className={styles.actionBar}>
        {!props.disabledActions?.includes('CSB') && (
          <ActionIcon
            icon={Codesandbox}
            onClick={() => openCodeSandbox(props)}
            size={SIZE}
            title={intl.formatMessage({
              id: 'previewer.actions.codesandbox',
            })}
          />
        )}
        {!props.disabledActions?.includes('STACKBLITZ') && (
          <ActionIcon
            icon={Zap}
            onClick={() => openStackBlitz(props)}
            size={SIZE}
            title={intl.formatMessage({
              id: 'previewer.actions.stackblitz',
            })}
          />
        )}
        {!props.disabledActions?.includes('EXTERNAL') && (
          <a href={props.demoUrl} rel="noreferrer" target="_blank">
            <ActionIcon
              icon={MonitorUp}
              size={SIZE}
              title={intl.formatMessage({
                id: 'previewer.actions.separate',
              })}
            />
          </a>
        )}
        {!props.forceShowCode && (
          <ActionIcon
            icon={showCode ? Code2 : Code}
            onClick={() => setShowCode((previous) => !previous)}
            size={SIZE}
            title={intl.formatMessage({
              id: `previewer.actions.code.${showCode ? 'shrink' : 'expand'}`,
            })}
          />
        )}
      </div>
      {showCode && (
        <>
          <div className={styles.tabs}>
            {!isSingleFile && (
              <TabsNav
                activeKey={String(activeKey)}
                items={files.map(([filename], index) => ({
                  key: String(index),
                  label: filename,
                }))}
                onChange={(key) => setActiveKey(Number(key))}
              />
            )}
          </div>
          <SourceCode lang={lang}>{files[activeKey][1].value}</SourceCode>
        </>
      )}
    </>
  );
};

export default PreviewerActions;
