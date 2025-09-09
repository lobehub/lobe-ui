import { describe, expect, it } from 'vitest';

import { removeLineBreaksInAntArtifact } from './utils';

describe('removeLineBreaksInAntArtifact', () => {
  it('闭合情况下移除回车', () => {
    // 使用示例
    const input = `好的

<antArtifact identifier="sleep-interpretation-card" type="image/svg+xml" title="睡觉的新解释">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
<defs>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&amp;display=swap');
</style>
</defs>
<!-- 背景 -->
<rect width="400" height="600" fill="#F0EAD6"/>
<!-- 总结 -->
<text x="200" y="500" font-family="'Noto Serif SC', serif" font-size="20" text-anchor="middle" fill="#8B4513">睡觉：生产力的假死，创造力的重生。</text>
</svg>
</antArtifact>`;

    const output = removeLineBreaksInAntArtifact(input);
    console.log(output);

    expect(output).toEqual(`好的

<antArtifact identifier="sleep-interpretation-card" type="image/svg+xml" title="睡觉的新解释"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><defs><style>@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&amp;display=swap');</style></defs><!-- 背景 --><rect width="400" height="600" fill="#F0EAD6"/><!-- 总结 --><text x="200" y="500" font-family="'Noto Serif SC', serif" font-size="20" text-anchor="middle" fill="#8B4513">睡觉：生产力的假死，创造力的重生。</text></svg></antArtifact>`);
  });
  it('闭合情况下移除回车', () => {
    // 使用示例
    const input = `好的

<antArtifact identifier="ai-interpretation-card" type="image/svg+xml" title="人工智能新解卡片">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&amp;display=swap');
    </style>
  </defs>
`;

    const output = removeLineBreaksInAntArtifact(input);

    expect(output).toEqual(`好的

<antArtifact identifier="ai-interpretation-card" type="image/svg+xml" title="人工智能新解卡片"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">  <defs>    <style>      @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&amp;display=swap');    </style>  </defs>`);
  });
});
