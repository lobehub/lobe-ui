import { ToggleGroup, type ToggleGroupProps } from '@lobehub/ui/base-ui';
import { createStyles } from 'antd-style';
import { CodeIcon, EyeIcon } from 'lucide-react';

const useStyles = createStyles(({ css, token }) => ({
  toolbar: css`
    container-type: inline-size;
    display: flex;
    justify-content: flex-end;

    padding: 8px;
    border: 1px dashed ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;

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
  const { styles } = useStyles();

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
