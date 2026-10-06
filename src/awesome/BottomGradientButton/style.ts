import { createStaticStyles, cx, lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) =>
  cx(
    lobeStaticStylish.resetLinkColor,
    css`
      overflow: hidden;
      font-weight: bold;
      transition: all 0.2s ease-in-out;

      &::before {
        content: '';

        position: absolute;
        inset-block-end: 0;

        display: block;

        width: 50%;
        height: 1px;

        opacity: 0;
        background-image: linear-gradient(to right, transparent, ${cssVar.gold}, transparent);

        transition: all 0.2s ease-in-out;
      }

      &&:not(:hover) {
        color: ${cssVar.colorTextSecondary};
      }

      &:hover {
        &::before {
          opacity: 1;
        }
      }
    `,
  ),
);
