import type { RawMessage, Transformer } from './index.js';

export const botFilter: Transformer<RawMessage, RawMessage> =
  (func: (message: RawMessage) => Promise<void>) =>
  async (message: RawMessage) => {
    if (!message.author?.bot && !message.system) {
      await func(message);
    }
  };
