import { DebugCommand, MessageRepository } from './debug.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { Snowflake } from '../../model/id.js';
import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

describe('debug', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  const repo: MessageRepository = {
    getMessageContent: () => Promise.resolve(undefined)
  };
  const responder = new DebugCommand(repo);

  it('outputs debug format', async () => {
    const getMessageContent = vi
      .spyOn(repo, 'getMessageContent')
      .mockImplementation(() => Promise.resolve('🅰️ Hoge'));
    const reply = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['debug', '1423523'], responder.schema),
        reply,
        {
          senderChannelId: '8623233' as Snowflake
        }
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: 'デバッグ出力',
      description: '```\n🅰️ Hoge\n```'
    });
  });

  it('replaces triple back quotes', async () => {
    const getMessageContent = vi
      .spyOn(repo, 'getMessageContent')
      .mockImplementation(() =>
        Promise.resolve(`\`\`\`js
console.log(\`Hello, \${name}!\`);
\`\`\``)
      );
    const reply = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['debug', '1423523'], responder.schema),
        reply,
        {
          senderChannelId: '8623233' as Snowflake
        }
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: 'デバッグ出力',
      description: `\`\`\`
'''js
console.log(\`Hello, \${name}!\`);
'''
\`\`\``,
      footer:
        "三連続の ` (バッククォート) は ' (シングルクォート) に置換してあるよ。"
    });
  });

  it('errors on message not found', async () => {
    const getMessageContent = vi.spyOn(repo, 'getMessageContent');
    const reply = vi.fn();
    await responder.on(
      createMockMessage(
        parseStringsOrThrow(['debug', '1423523'], responder.schema),
        reply,
        {
          senderChannelId: '8623233' as Snowflake
        }
      )
    );
    expect(getMessageContent).toHaveBeenCalledWith('8623233', '1423523');
    expect(reply).toHaveBeenCalledWith({
      title: '指定のメッセージが見つからなかったよ',
      description: 'そのメッセージがこのチャンネルにあるかどうか確認してね。'
    });
  });
});
