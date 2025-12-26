import { createStaticStyles, cx } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  icon: css`
    color: ${cssVar.colorTextPlaceholder};
  `,
  search: css`
    position: relative;
    max-width: 100%;
  `,
  tag: cx(
    lobeStaticStylish.blur,
    css`
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: 6px;
      transform: translateY(-50%);

      color: ${cssVar.colorTextDescription};

      kbd {
        color: inherit;
      }
    `,
  ),
}));
