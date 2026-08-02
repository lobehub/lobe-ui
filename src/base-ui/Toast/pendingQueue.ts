const MAX_QUEUED_ACTIONS = 20;
const QUEUE_TTL_MS = 5000;

interface QueuedAction {
  queuedAt: number;
  run: () => void;
}

let ready = false;
let queue: QueuedAction[] = [];

export const runWhenToastHostReady = (run: () => void): void => {
  if (ready) {
    run();
    return;
  }
  if (queue.length >= MAX_QUEUED_ACTIONS) {
    queue.shift();
  }
  queue.push({ queuedAt: Date.now(), run });
};

export const markToastHostReady = (): void => {
  ready = true;
  const pending = queue;
  queue = [];
  const now = Date.now();
  for (const action of pending) {
    if (now - action.queuedAt <= QUEUE_TTL_MS) action.run();
  }
};

export const markToastHostNotReady = (): void => {
  ready = false;
};

export const __resetPendingToastQueueForTests = (): void => {
  ready = false;
  queue = [];
};
