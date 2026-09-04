import { ToggleGroup, type ToggleGroupProps } from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import { CodeIcon, EyeIcon } from 'lucide-react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  toolbar: css`
    container-type: inline-size;
    display: flex;
    justify-content: flex-end;

    padding: 8px;
    border: 1px dashed ${cssVar.colorBorder};
    border-radius: ${cssVar.borderRadiusLG};

    @container (max-width: 200px) {
      .toggle-group-item-label {
        display: none;
      }
    }
  `,
}));

const options: ToggleGroupProps['options'] = [
  { icon: <EyeIcon size={14} />, label: 'Preview', value: 'preview' },
  { icon: <CodeIcon size={14} />, label: 'Source', value: 'source' },
];

export default () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <div className={styles.toolbar} style={{ width: 320 }}>
        <ToggleGroup defaultValue="preview" options={options} variant="borderless" />
      </div>
      <div className={styles.toolbar} style={{ width: 160 }}>
        <ToggleGroup defaultValue="preview" options={options} variant="borderless" />
      </div>
    </div>
  );
};
