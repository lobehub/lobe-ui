import { Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const content = `![Gallery Image 1](https://github.com/user-attachments/assets/2428a136-38bf-488c-8033-d9f261d67f3d)`;

export default () => {
  const store = useCreateStore();
  const { children, enableCustomComponents } = useControls(
    {
      children: {
        rows: true,
        value: content,
      },
      enableCustomComponents: true,
    },
    { store },
  ) as any;

  return (
    <StoryBook levaStore={store}>
      <Markdown
        components={
          enableCustomComponents
            ? {
                img: ({ src, alt }: any) => (
                  <img
                    alt={alt}
                    src={src}
                    style={{
                      border: '5px solid green',
                      borderRadius: '20px',
                    }}
                  />
                ),
              }
            : undefined
        }
      >
        {children}
      </Markdown>
    </StoryBook>
  );
};
