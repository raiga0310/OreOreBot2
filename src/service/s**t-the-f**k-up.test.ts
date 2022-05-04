import { type Sheriff, SheriffCommand } from './s**t-the-f**k-up';
import { createMockMessage } from './command-message';

test('use case of stfu', async () => {
  const sheriff: Sheriff = {
    executeMessage(channel, historyRange) {
      console.log(channel, historyRange);
      return Promise.resolve();
    }
  };
  const responder = new SheriffCommand(sheriff);
  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['sftu'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});

test('delete message', async () => {
  const sheriff: Sheriff = {
    executeMessage(channel, historyRange) {
      console.log(channel, historyRange);
      return Promise.resolve();
    }
  };
  const responder = new SheriffCommand(sheriff);
  const fn = jest.fn();
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['sftu'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});

test('other command', async () => {
  const sheriff: Sheriff = {
    executeMessage(channel, historyRange) {
      console.log(channel, historyRange);
      return Promise.resolve();
    }
  };
  const responder = new SheriffCommand(sheriff);
  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['sft'],
      reply: fn
    })
  );

  expect(fn).not.toHaveBeenCalled();
});
