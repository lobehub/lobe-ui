// Manager for handling Web Worker highlighting requests
import type { HighlightRequest, HighlightResponse } from './highlightWorker';

interface PendingRequest {
  resolve: (html: string) => void;
  reject: (error: Error) => void;
  timestamp: number;
  cancelled: boolean;
}

class HighlightWorkerManager {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private requestCounter = 0;
  private isInitialized = false;
  private activeRequestId: string | null = null;

  // Initialize worker
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Create worker from blob to avoid separate file issues
      const workerBlob = new Blob([
        `
        import {
          transformerNotationDiff,
          transformerNotationErrorLevel,
          transformerNotationFocus,
          transformerNotationHighlight,
          transformerNotationWordHighlight,
        } from '@shikijs/transformers';

        let shikiInstance = null;

        const initShiki = async () => {
          if (!shikiInstance) {
            const { codeToHtml } = await import('shiki');
            shikiInstance = codeToHtml;
          }
          return shikiInstance;
        };

        const handleHighlightRequest = async (request) => {
          const { id, code, options } = request;
          
          try {
            const startTime = performance.now();
            const codeToHtml = await initShiki();
            
            const html = await codeToHtml(code, options);
            
            const endTime = performance.now();
            console.log(\`[Worker] Highlight completed in \${(endTime - startTime).toFixed(2)}ms for \${code.length} chars\`);
            
            return { id, html };
          } catch (error) {
            console.error('[Worker] Highlight error:', error);
            return { id, error: error instanceof Error ? error.message : 'Unknown error' };
          }
        };

        self.addEventListener('message', async (event) => {
          const request = event.data;
          const response = await handleHighlightRequest(request);
          self.postMessage(response);
        });
        `
      ], { type: 'application/javascript' });

      this.worker = new Worker(URL.createObjectURL(workerBlob), { type: 'module' });
      
      // Handle worker messages
      this.worker.onmessage = (event) => {
        const response = event.data as HighlightResponse;
        this.handleWorkerResponse(response);
      };

      // Handle worker errors
      this.worker.onerror = (error) => {
        console.error('[WorkerManager] Worker error:', error);
        this.rejectAllPending(new Error('Worker error'));
      };

      this.isInitialized = true;
      console.log('[WorkerManager] Worker initialized successfully');
    } catch (error) {
      console.error('[WorkerManager] Failed to initialize worker:', error);
      throw error;
    }
  }

  // Handle worker response
  private handleWorkerResponse(response: HighlightResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;

    this.pendingRequests.delete(response.id);

    // Check if request was cancelled
    if (pending.cancelled) {
      console.log(`[WorkerManager] Request ${response.id} was cancelled, ignoring response`);
      return;
    }

    // Clear active request if this is the one
    if (this.activeRequestId === response.id) {
      this.activeRequestId = null;
    }

    if (response.error) {
      pending.reject(new Error(response.error));
    } else if (response.html) {
      pending.resolve(response.html);
    } else {
      pending.reject(new Error('Invalid response'));
    }
  }

  // Cancel previous requests
  private cancelPreviousRequests(): void {
    console.log(`[WorkerManager] Cancelling ${this.pendingRequests.size} pending requests`);
    for (const [, pending] of this.pendingRequests) {
      pending.cancelled = true;
    }
    this.pendingRequests.clear();
    this.activeRequestId = null;
  }

  // Reject all pending requests
  private rejectAllPending(error: Error): void {
    for (const [, pending] of this.pendingRequests) {
      if (!pending.cancelled) {
        pending.reject(error);
      }
    }
    this.pendingRequests.clear();
  }

  // Highlight code using worker
  async highlight(code: string, options: any): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.worker) {
      throw new Error('Worker not available');
    }

    // Cancel previous requests to avoid unnecessary computation
    this.cancelPreviousRequests();

    const id = `highlight-${++this.requestCounter}`;
    const request: HighlightRequest = { id, code, options };

    // Set this as the active request
    this.activeRequestId = id;

    console.log(`[WorkerManager] Starting new highlight request: ${id}`);

    return new Promise<string>((resolve, reject) => {
      // Store pending request
      this.pendingRequests.set(id, {
        resolve,
        reject,
        timestamp: Date.now(),
        cancelled: false,
      });

      // Send request to worker
      this.worker!.postMessage(request);

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          const pending = this.pendingRequests.get(id);
          this.pendingRequests.delete(id);
          
          if (pending && !pending.cancelled) {
            reject(new Error('Worker timeout'));
          }
        }
      }, 10000); // 10 second timeout
    });
  }

  // Cleanup
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.rejectAllPending(new Error('Worker destroyed'));
    this.isInitialized = false;
  }

  // Check if worker is available
  get isAvailable(): boolean {
    return typeof window !== 'undefined' && 'Worker' in window;
  }
}

// Singleton instance
let workerManager: HighlightWorkerManager | null = null;

export const getWorkerManager = (): HighlightWorkerManager => {
  if (!workerManager) {
    workerManager = new HighlightWorkerManager();
  }
  return workerManager;
};

export { HighlightWorkerManager };