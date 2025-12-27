import { createStaticStyles, cx } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: css`
      color: ${cssVar.colorText};
    `,
    container: css`
      cursor: pointer;
      color: ${cssVar.colorTextDescription};
    `,

    img: cx(
      lobeStaticStylish.variantFilled,
      css`
        border-radius: ${cssVar.borderRadius};

        &:hover {
          box-shadow: 0 0 0 2px ${cssVar.colorText};
        }
      `,
    ),
    imgActive: cx(
      lobeStaticStylish.active,
      css`
        box-shadow: 0 0 0 2px ${cssVar.colorTextTertiary};
      `,
    ),
  };
});
