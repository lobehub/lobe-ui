import {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@lobehub/ui';
import { cssVar } from 'antd-style';

const items = Array.from({ length: 64 }, (_, index) => index + 1);

export default () => {
  return (
    <ScrollAreaRoot
      style={{
        height: 240,
        maxWidth: 'calc(100vw - 8rem)',
        width: '100%',
      }}
    >
      <ScrollAreaViewport scrollFade="both">
        <ScrollAreaContent style={{ padding: 16 }}>
          <ul
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(8, 6rem)',
              gridTemplateRows: 'repeat(8, 6rem)',
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
                  background: cssVar.colorFillTertiary,
                  borderRadius: 8,
                  color: cssVar.colorTextSecondary,
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
