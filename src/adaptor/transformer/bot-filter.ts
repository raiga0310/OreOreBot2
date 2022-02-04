import type { Transformer, RawMessage } from '.';

export const botFilter: Transformer<RawMessage, RawMessage> =
  (func: (message: RawMessage) => Promise<void>) =>
  async (message: RawMessage) => {
    if (!message.author?.bot) {
      await func(message);
    }
  };
