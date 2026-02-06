import { Markdown, type MarkdownProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const paragraphsContent = `# 长文段落示例

这是第一段文字。在现代网页设计中，文本排版是至关重要的。良好的段落间距和行高能够显著提升阅读体验。当我们使用 text-box-trim 属性时，可以更精确地控制文本的垂直空间，消除不必要的空白。

这是第二段文字。通过设置合适的 margin-inline-start 和 margin-inline-end，我们可以为段落添加适当的水平间距。这种设计方式特别适合需要突出段落结构的场景，比如文章阅读、文档展示等。

这是第三段文字。行高设置为 2 意味着每行文字之间会有更宽松的间距，这对于长文本阅读来说是非常友好的。较宽的行高可以减少视觉疲劳，让读者更容易跟随文本的节奏。

这是第四段文字。当浏览器支持 text-box-trim: trim-both 时，文本的上下空白会被自动修剪，这样可以更精确地控制段落之间的间距。配合 text-edge: cap alphabetic，我们可以实现更加精确的文本对齐效果。

这是第五段文字。在实际应用中，这种排版方式特别适合展示长篇文章、博客内容、技术文档等需要良好阅读体验的场景。通过合理的间距设置，可以让内容更加清晰易读。

这是第六段文字。段落之间的间距通过 margin-block-start 和 margin-block-end 来控制，而水平方向的间距则通过 margin-inline-start 和 margin-inline-end 来设置。这种分离的设计方式让我们可以更灵活地控制排版效果。

这是第七段文字。在现代前端开发中，CSS 的新特性为我们提供了更多的排版控制能力。text-box-trim 和 text-edge 等属性的引入，让我们可以更精确地控制文本的显示效果，实现更加专业的排版设计。

这是第八段文字。通过这个示例，我们可以看到多个段落之间的间距效果。每个段落都有适当的水平边距，行高设置为 2 让文本更加易读。这种设计方式在长文本阅读场景中非常有效。

这是第九段文字。文本排版不仅仅是技术问题，更是用户体验的重要组成部分。良好的排版可以让用户更容易理解内容，减少阅读负担，提升整体的使用体验。这也是为什么我们需要关注这些细节的原因。

这是第十段文字。最后一段文字用来展示完整的段落效果。通过合理的间距和行高设置，我们可以创造出既美观又实用的文本排版效果。这种设计方式值得在实际项目中应用和推广。`;

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      children: {
        rows: true,
        value: paragraphsContent,
      },
      fontSize: {
        max: 32,
        min: 12,
        step: 1,
        value: 16,
      },
      headerMultiple: {
        max: 3,
        min: 0,
        step: 0.1,
        value: 1,
      },
      lineHeight: {
        max: 3,
        min: 1,
        step: 0.1,
        value: 1.8,
      },
      marginMultiple: {
        max: 5,
        min: 0,
        step: 0.1,
        value: 2,
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
