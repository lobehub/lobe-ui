import { ScrollArea } from '@lobehub/ui';

const codeSample = `const veryLongVariableName = 'This single non-breaking line is much wider than the surrounding flex container';
function example(input) {
  return input.map((item) => item.toString().padStart(40)).join(' >>> ');
}`;

const Demo = ({ disableContentFit, label }: { disableContentFit?: boolean; label: string }) => (
  <div>
    <div
      style={{
        color: 'var(--lobe-color-text-secondary)',
        fontSize: 12,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div
      style={{
        alignSelf: 'flex-start',
        border: '1px dashed var(--lobe-color-warning)',
        borderRadius: 8,
        display: 'flex',
        gap: 12,
        minWidth: 0,
        padding: 12,
      }}
    >
      <div
        style={{
          alignSelf: 'flex-start',
          background: 'var(--lobe-color-fill-tertiary)',
          borderRadius: 999,
          color: 'var(--lobe-color-text-secondary)',
          fontSize: 12,
          padding: '4px 12px',
          whiteSpace: 'nowrap',
        }}
      >
        sibling
      </div>
      <ScrollArea
        disableContentFit={disableContentFit}
        style={{
          flex: 1,
          height: 160,
          minWidth: 0,
        }}
      >
        <p style={{ margin: 0 }}>
          Single non-breaking <code>&lt;pre&gt;</code> child below.
        </p>
        <pre
          style={{
            background: 'var(--lobe-color-fill-secondary)',
            borderRadius: 6,
            fontFamily: 'var(--lobe-font-family-code)',
            fontSize: 13,
            margin: 0,
            overflowX: 'auto',
            padding: 12,
          }}
        >
          <code>{codeSample}</code>
        </pre>
      </ScrollArea>
    </div>
  </div>
);

export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 'calc(100vw - 8rem)',
        padding: 8,
        width: 480,
      }}
    >
      <Demo label="default · disableContentFit={false} — the flex bubble is pushed wider than its 480px parent because the wide <pre> bubbles up through min-width: fit-content" />
      <Demo
        disableContentFit
        label="fixed · disableContentFit — bubble stays inside the 480px parent; the wide <pre> scrolls horizontally inside the viewport"
      />
    </div>
  );
};
