import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  (
    { css, responsive, token },
    { isEmpty, contentMaxWidth }: { contentMaxWidth: number; isEmpty: boolean },
  ) => {
    const prefix = `rc-footer`;

    return {
      container: css`
        grid-area: footer;
        align-self: stretch;

        color: ${token.colorTextDescription};
        text-align: center;

        border-block-start: 1px solid ${token.colorSplit};

        ${responsive.mobile} {
          flex-direction: column;
          border: none;
        }
      `,
      footer: css`
        font-size: 14px;
        line-height: 1.5;
        color: ${token.colorTextSecondary};
        background-color: ${token.colorBgLayout};

        &.${prefix} {
          a {
            color: ${token.colorTextTertiary};
            text-decoration: none;
            transition: all 0.3s;

            &:hover {
              color: ${token.colorLinkHover};
            }
          }
        }

        .${prefix} {
          &-container {
            width: 100%;
            max-width: ${contentMaxWidth}px;
            margin: auto;
            padding: ${isEmpty ? '0' : '60px 0 20px'};
          }

          &-columns {
            display: flex;
            justify-content: space-around;
          }

          &-column {
            text-align: start;

            h2 {
              position: relative;

              margin-block: 0;
              margin-inline: auto;

              font-size: 16px;
              font-weight: 500;
              color: ${token.colorText};
            }

            &-icon {
              position: relative;
              inset-block-start: -1px;

              display: inline-block;

              width: 22px;
              margin-inline-end: 0.5em;

              text-align: center;
              vertical-align: middle;

              > span,
              > svg,
              img {
                display: block;
                width: 100%;
              }
            }
          }

          &-item {
            margin-block: 12px;
            margin-inline: 0;

            &-icon {
              position: relative;
              inset-block-start: -1px;

              display: inline-block;

              width: 16px;
              margin-inline-end: 0.4em;

              text-align: center;
              vertical-align: middle;

              > span,
              > svg,
              img {
                display: block;
                width: 100%;
              }
            }

            &-separator {
              margin-block: 0;
              margin-inline: 0.3em;
            }
          }

          &-bottom {
            color: ${token.colorTextDescription};

            &-container {
              width: 100%;
              max-width: ${contentMaxWidth}px;
              margin-block: 0;
              margin-inline: auto;
              padding-block: 16px;
              padding-inline: 0;

              line-height: 32px;
              text-align: center;
            }
          }

          &-light {
            color: rgba(0, 0, 0, 85%);
            background-color: transparent;

            h2,
            a {
              color: rgba(0, 0, 0, 85%);
            }
          }

          &-light &-bottom-container {
            border-block-start-color: #e8e8e8;
          }

          &-light &-item-separator,
          &-light &-item-description {
            color: rgba(0, 0, 0, 45%);
          }
        }

        ${responsive.mobile} {
          .${prefix} {
            &-container {
              padding-block: 40px;
              padding-inline: 0;
            }

            &-columns {
              display: block;
            }

            &-column {
              display: block;
              margin-block-end: 40px;
              text-align: center;

              &:last-child {
                margin-block-end: 0;
              }
            }
          }
        }
      `,
    };
  },
);
