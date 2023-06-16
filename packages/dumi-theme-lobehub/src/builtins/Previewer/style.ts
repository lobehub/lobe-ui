import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token, prefixCls }) => {
  return {
    center: css`
      .dumi-default-previewer-demo {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
    container: css`
      .dumi-default-previewer {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-color: ${token.colorBorderSecondary};

        &-demo {
          flex: 1;

          &[data-iframe]::before {
            background: ${token.colorFillContent};
          }
        }

        &-meta {
          flex: 1;
          border-color: ${token.colorBorderSecondary};

          .${prefixCls}-highlighter {
            pre {
              border-radius: 0 !important;
            }
          }
        }

        &-actions:not(:last-child) {
          border-color: ${token.colorBorderSecondary};
        }

        &-desc {
          .markdown {
            border-color: ${token.colorBorderSecondary};
          }

          h5 {
            background: linear-gradient(
              to top,
              ${token.colorBgContainer},
              ${rgba(token.colorBgContainer, 0.95)} 50%,
              ${rgba(token.colorBgContainer, 0)} 100%
            );

            a {
              color: ${token.colorText};
            }
          }
        }

        &-tabs::after {
          border-color: ${token.colorBorderSecondary};
        }
      }

      .dumi-default-tabs-tab {
        &-btn {
          color: ${token.colorTextTertiary};
        }

        &-active {
          .dumi-default-tabs-tab-btn {
            color: ${token.colorText};
          }
        }
      }
    `,
    left: css`
      .dumi-default-previewer {
        flex-direction: row-reverse;

        &-demo {
          width: 50%;
          border-left: 1px solid ${token.colorBorderSecondary};
        }

        &-meta {
          width: 50%;
        }
      }
    `,
    nopadding: css`
      .dumi-default-previewer-demo {
        padding: 0;
      }
    `,
    pure: css`
      .dumi-default-previewer {
        margin: 0;
        padding: 0;
        border: none;
      }

      .dumi-default-previewer-demo {
        padding: 0;
      }

      .dumi-default-previewer-meta {
        display: none;
      }
    `,

    right: css`
      .dumi-default-previewer {
        flex-direction: row;

        &-demo {
          width: 50%;
          border-right: 1px solid ${token.colorBorderSecondary};
        }

        &-meta {
          width: 50%;
        }
      }
    `,

    top: css`
      .dumi-default-previewer {
        flex-direction: column-reverse;

        &-meta {
          display: flex;
          flex-direction: column;
        }

        &-actions {
          order: 1;
        }

        &-desc {
          order: 2;
        }
      }
    `,
  };
});
