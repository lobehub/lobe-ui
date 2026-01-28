import {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@lobehub/ui';

const items = Array.from({ length: 100 }, (_, index) => index + 1);

export default () => {
  return (
    <ScrollAreaRoot
      style={{
        height: 320,
        maxWidth: 'calc(100vw - 8rem)',
        width: '100%',
      }}
    >
      <ScrollAreaViewport>
        <ScrollAreaContent style={{ padding: 20 }}>
          <ul
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(10, 6.25rem)',
              gridTemplateRows: 'repeat(10, 6.25rem)',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {items.map((item) => (
              <li
                key={item}
                style={{
                  alignItems: 'center',
                  background: 'var(--lobe-color-fill-tertiary)',
                  borderRadius: 8,
                  color: 'var(--lobe-color-text-secondary)',
                  display: 'flex',
                  fontSize: 14,
                  fontWeight: 500,
                  justifyContent: 'center',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar>
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollAreaRoot>
  );
};
