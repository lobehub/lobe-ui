import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
import { createStaticStyles, cssVar } from 'antd-style';
import { Check, SquareChevronRight } from 'lucide-react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  chip: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;

    padding-block: 2px;
    padding-inline: 10px;
    border-radius: 999px;

    font-family: ${cssVar.fontFamilyCode};
    font-size: 12px;

    background: ${cssVar.colorFillTertiary};
  `,
  row: css`
    display: flex;
    gap: 6px;
    align-items: center;
  `,
}));

export default () => (
  <Flexbox gap={12} padding={16}>
    <Text shiny>Plain shiny text</Text>

    <Text shiny className={styles.row}>
      <span>Bash:</span>
      <span className={styles.chip}>
        <SquareChevronRight size={14} />
        Read round-3 actionable review feedback
      </span>
      <Check color={cssVar.colorSuccess} size={14} />
    </Text>
  </Flexbox>
);
