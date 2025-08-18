import { visit } from 'unist-util-visit';

/**
 * Remark plugin to handle <br> and <br/> tags in markdown text
 * This plugin converts <br> and <br/> tags to proper HTML elements
 * without requiring allowHtml to be enabled
 */
export const remarkBr = () => {
  return (tree: any) => {
    console.log('remarkBr plugin running...');

    // First try to process html nodes that might contain ONLY br tags
    visit(tree, 'html', (node, index, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      // Only handle standalone br tags, not complex HTML containing br tags
      const brRegex = /^\s*<\s*br\s*\/?>\s*$/gi;
      if (brRegex.test(node.value)) {
        console.log('Found standalone br tag in HTML node:', node.value);
        // Replace the html node with a break node
        parent.children.splice(index, 1, { type: 'break' });
        return index;
      }
    });

    // Also process text nodes
    visit(tree, 'text', (node, index = 0, parent) => {
      if (!node.value || typeof node.value !== 'string') return;

      // Check if the text contains <br> or <br/> tags
      const brRegex = /<\s*br\s*\/?>/gi;

      if (!brRegex.test(node.value)) return;

      console.log('Found br tag in text:', node.value);

      // Reset regex lastIndex for split operation
      brRegex.lastIndex = 0;

      // Split the text by br tags, but keep the matched tags
      const parts: string[] = [];
      const matches: string[] = [];
      let lastIndex = 0;
      let match;

      while ((match = brRegex.exec(node.value)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(node.value.slice(lastIndex, match.index));
        }

        // Store the matched br tag
        matches.push(match[0]);
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after the last match
      if (lastIndex < node.value.length) {
        parts.push(node.value.slice(lastIndex));
      }

      // Create new nodes
      const newNodes: any[] = [];

      for (const [i, part] of parts.entries()) {
        // Add text node if not empty
        if (part) {
          newNodes.push({
            type: 'text',
            value: part,
          });
        }

        // Add br element if we have a corresponding match
        if (i < matches.length) {
          newNodes.push({
            type: 'break',
          });
        }
      }

      // Replace the original text node with the new nodes
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length - 1; // Skip the newly added nodes
      }
    });
  };
};
