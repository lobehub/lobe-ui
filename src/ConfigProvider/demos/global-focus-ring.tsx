import { Flexbox, Tag, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { type MouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  actions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,
  case: css`
    display: flex;
    flex-direction: column;
    gap: 12px;

    min-width: 0;
    padding: 16px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgContainer};
  `,
  cases: css`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @media (width <= 640px) {
      grid-template-columns: 1fr;
    }
  `,
  clip: css`
    overflow: hidden;

    min-height: 84px;
    border: 1px dashed ${cssVar.colorBorder};
    border-radius: 10px;

    background: ${cssVar.colorFillQuaternary};
  `,
  edgeTarget: css`
    width: calc(100% - 24px);
    margin-block: 0;
    margin-inline: 12px;
  `,
  input: css`
    box-sizing: border-box;
    width: 100%;
    padding-block: 9px;
    padding-inline: 12px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 8px;

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgContainer};

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 2px;
    }
  `,
  target: css`
    cursor: pointer;

    padding-block: 9px;
    padding-inline: 12px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 8px;

    color: ${cssVar.colorText};

    background: ${cssVar.colorBgElevated};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 2px;
    }
  `,
}));

interface CaseProps {
  children: ReactNode;
  description: string;
  expected: string;
  id: string;
  title: string;
}

const Case = ({ children, description, expected, id, title }: CaseProps) => (
  <section className={styles.case} data-focus-ring-case={id}>
    <Flexbox horizontal align="center" gap={8}>
      <Tag color="blue">Case {id}</Tag>
      <Text strong>{title}</Text>
    </Flexbox>
    <Text style={{ fontSize: 13 }} type="secondary">
      {description}
    </Text>
    {children}
    <Text style={{ fontSize: 12 }} type="secondary">
      <strong>Expected:</strong> {expected}
    </Text>
  </section>
);

interface RingState {
  managed: boolean;
  open: boolean;
}

const Demo = () => {
  const lifecycleTargetRef = useRef<HTMLButtonElement>(null);
  const [ringState, setRingState] = useState<RingState>({ managed: false, open: false });

  const readRingState = useCallback(() => {
    setRingState({
      managed: lifecycleTargetRef.current?.dataset.lobeFocusRing === 'managed',
      open:
        document.querySelector('[data-lobe-global-focus-ring]')?.matches(':popover-open') ?? false,
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(readRingState);
      });
    };
    document.addEventListener('focusin', schedule);
    window.addEventListener('blur', schedule);
    window.addEventListener('focus', schedule);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('focusin', schedule);
      window.removeEventListener('blur', schedule);
      window.removeEventListener('focus', schedule);
    };
  }, [readRingState]);

  const keepTargetFocused = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();

  return (
    <Flexbox data-focus-ring-demo gap={20} padding={24}>
      <Flexbox gap={4}>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>Global keyboard focus cases</Text>
        <Text type="secondary">
          Use Tab to enter each target. The blue ring is rendered in the top layer, outside local
          clipping contexts.
        </Text>
      </Flexbox>

      <div className={styles.cases}>
        <Case
          description="Press Tab until this native control is focused."
          expected="One rounded ring follows the button without changing its layout."
          id="1"
          title="Native control"
        >
          <div>
            <button className={styles.target} type="button">
              Baseline focus target
            </button>
          </div>
        </Case>

        <Case
          description="The target touches the top edge of an overflow-hidden container."
          expected="The complete ring remains visible outside the dashed clipping boundary."
          id="2"
          title="Clipping boundary"
        >
          <div className={styles.clip}>
            <button className={`${styles.target} ${styles.edgeTarget}`} type="button">
              Clipped-edge focus target
            </button>
          </div>
        </Case>

        <Case
          description="Focus the edge target, then simulate window blur and restore focus. The action buttons keep the target focused."
          expected="Blur hides the global ring while managed stays yes; restore shows the full ring again."
          id="3"
          title="Window blur and restore"
        >
          <div className={styles.clip}>
            <button
              className={`${styles.target} ${styles.edgeTarget}`}
              ref={lifecycleTargetRef}
              type="button"
            >
              Window lifecycle focus target
            </button>
          </div>
          <Flexbox horizontal gap={8} wrap="wrap">
            <Tag color={ringState.managed ? 'green' : 'default'}>
              managed: {ringState.managed ? 'yes' : 'no'}
            </Tag>
            <Tag color={ringState.open ? 'green' : 'default'}>
              ring open: {ringState.open ? 'yes' : 'no'}
            </Tag>
          </Flexbox>
          <div className={styles.actions}>
            <button
              className={styles.target}
              disabled={!ringState.managed}
              type="button"
              onClick={() => window.dispatchEvent(new Event('blur'))}
              onMouseDown={keepTargetFocused}
            >
              Simulate window blur
            </button>
            <button
              className={styles.target}
              disabled={!ringState.managed}
              type="button"
              onClick={() => window.dispatchEvent(new Event('focus'))}
              onMouseDown={keepTargetFocused}
            >
              Restore window focus
            </button>
          </div>
        </Case>

        <Case
          description="Text editing and explicit opt-out keep their local focus treatment."
          expected="Both controls use their own outline instead of the global ring."
          id="4"
          title="Local focus fallbacks"
        >
          <Flexbox gap={12}>
            <input
              aria-label="Text input with local focus"
              className={styles.input}
              placeholder="Text input"
            />
            <div>
              <button className={styles.target} data-lobe-focus-ring="off" type="button">
                Explicit local focus
              </button>
            </div>
          </Flexbox>
        </Case>
      </div>
    </Flexbox>
  );
};

export { Demo as default };
