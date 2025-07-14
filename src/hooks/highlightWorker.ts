// Web Worker for Shiki highlighting
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import type { BuiltinTheme, CodeToHastOptions } from 'shiki';

interface HighlightRequest {
  id: string;
  code: string;
  options: CodeToHastOptions;
}

interface HighlightResponse {
  id: string;
  html?: string;
  error?: string;
}

// Cache for shiki instance
let shikiInstance: any = null;

// Initialize shiki
const initShiki = async () => {
  if (!shikiInstance) {
    const { codeToHtml } = await import('shiki');
    shikiInstance = codeToHtml;
  }
  return shikiInstance;
};

// Handle highlight request
const handleHighlightRequest = async (request: HighlightRequest): Promise<HighlightResponse> => {
  const { id, code, options } = request;
  
  try {
    const startTime = performance.now();
    
    // Initialize shiki if not already done
    const codeToHtml = await initShiki();
    
    // Create transformers if needed
    const transformers = options.transformers || [];
    
    // Perform highlighting
    const html = await codeToHtml(code, {
      ...options,
      transformers,
    });
    
    const endTime = performance.now();
    console.log(`[Worker] Highlight completed in ${(endTime - startTime).toFixed(2)}ms for ${code.length} chars`);
    
    return { id, html };
  } catch (error) {
    console.error('[Worker] Highlight error:', error);
    return { id, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Listen for messages from main thread
self.addEventListener('message', async (event) => {
  const request = event.data as HighlightRequest;
  const response = await handleHighlightRequest(request);
  self.postMessage(response);
});

// Export type for TypeScript
export type { HighlightRequest, HighlightResponse };