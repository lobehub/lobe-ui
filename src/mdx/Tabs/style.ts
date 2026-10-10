import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    body: css`
      padding-inline: 1em;

      > div {
        margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      }
    `,
    container: css`
      /* Container styles */
    `,
    header: css`
      /* Header styles */
    `,
    indicator: css`
      && {
        height: 3px;
        border-start-start-radius: 3px;
        border-start-end-radius: 3px;
      }
    `,
    list: css`
      && {
        gap: 8px;
        padding: 4px;
        box-shadow: none;
      }
    `,
    tab: css`
      && {
        height: auto;
        padding-block: 8px;
        padding-inline: 12px;
        border-radius: ${cssVar.borderRadius};

        font-size: 14px;
        font-weight: 400;
        line-height: 22px;

        transition: background-color 100ms ease-out;
      }

      &&:hover:not([data-disabled]) {
        background: ${cssVar.colorFillTertiary};
      }
    `,
  };
});
