import { IntersectionLoad } from '@/components/LazyLoad';
import { createStyles } from 'antd-style';
import { IPreviewerProps } from 'dumi/dist/client/theme-api/types';
import Previewer from 'dumi/theme-default/builtins/Previewer';
import { rgba } from 'polished';
import { useMemo } from 'react';

const useStyles = createStyles(({ css, token, prefixCls }, { center, nopadding }: any) => {
  return {
    container: css`
      .dumi-default-previewer {
        border-color: ${token.colorBorderSecondary};
        display: flex;
        flex-direction: column;

        &-demo {
          flex: 1;
          ${nopadding &&
          css`
            padding: 0;
          `}
          ${center &&
          css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
          &[data-iframe]::before {
            background: ${token.colorFillContent};
          }
        }

        &-meta {
          border-color: ${token.colorBorderSecondary};
          flex: 1;

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
  };
});

export interface PreviewerProps extends IPreviewerProps {
  center?: boolean;
  nopadding?: boolean;
}

export default (props: IPreviewerProps) => {
  const { styles, cx } = useStyles(props);

  const height = useMemo(() => {
    if (typeof props.iframe === 'number') {
      return props.iframe;
    }
    if (props.height) {
      return props.height;
    }
    return 300;
  }, [props.iframe, props.height]);

  return (
    <div className={cx(styles.container, styles[props.codePlacement as 'left' | 'right' | 'top'])}>
      <IntersectionLoad height={height} elementType="section">
        <Previewer {...props} />
      </IntersectionLoad>
    </div>
  );
};
