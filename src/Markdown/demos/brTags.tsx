import { Markdown, MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const brTagsContent = `# BR Tags Test

## Basic Usage

This is line 1<br>This is line 2

This is line 1<br/>This is line 2

## In Tables

|Column 1<br/>Line 2|Column 2<br>Line 2|Column 3|
|:--|:--|:--|
|Cell 1<br/>Text|Cell 2<br>Text|Cell 3|
|Normal cell|Another<br/>cell|Last cell|

## Multiple BR Tags

First line<br>Second line<br/>Third line

## BR Tags with Spaces

Line with<br >space after
Line with< br/>space before
Line with< br >spaces around

## Edge Cases

<br>Starting with br
Ending with br<br/>
<br>Multiple<br>consecutive<br/>tags
`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: brTagsContent,
      },
    },
    { store },
  ) as MarkdownProps;

  return (
    <StoryBook levaStore={store}>
      <Markdown {...options} />
    </StoryBook>
  );
};
