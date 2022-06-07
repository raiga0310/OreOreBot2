import { type AssetKey, PartyCommand, type RandomGenerator } from './party';
import { SentMessage, createMockMessage } from './command-message';
import type { EmbedMessage } from '../model/embed-message';
import { MockClock } from '../adaptor';
import { MockVoiceConnectionFactory } from '../adaptor';
import { ScheduleRunner } from '../runner';

const random: RandomGenerator = {
  minutes: () => 42,
  pick: ([first]) => first
};

test('use case of party', async () => {
  const factory = new MockVoiceConnectionFactory<AssetKey>();
  const clock = new MockClock(new Date(0));
  const scheduleRunner = new ScheduleRunner(clock);
  const responder = new PartyCommand({
    factory,
    clock,
    scheduleRunner,
    random
  });

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: `パーティー Nigth`,
          description: 'хорошо、宴の始まりだ。'
        });
        return Promise.resolve();
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'status']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在無効だよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'enable']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラを有効化しておいたよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'status']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在有効だよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'disable']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラを無効化しておいたよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'status']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: 'ゲリラは現在無効だよ。'
        });
        return Promise.resolve();
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'time']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: '次のゲリラ参加時刻を42分にしたよ。'
        });
        return Promise.resolve();
      }
    )
  );
  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'time', '36']
      },
      (message) => {
        expect(message).toStrictEqual({
          title: '次のゲリラ参加時刻を36分にしたよ。'
        });
        return Promise.resolve();
      }
    )
  );

  await responder.on(
    'CREATE',
    createMockMessage(
      {
        args: ['party', 'set', '__UNKNOWN__']
      },
      (message) => {
        expect(message.title).toStrictEqual('BGMを設定できなかった。');
        return Promise.resolve();
      }
    )
  );

  scheduleRunner.killAll();
});

test('must not reply', async () => {
  const factory = new MockVoiceConnectionFactory();
  const clock = new MockClock(new Date(0));
  const scheduleRunner = new ScheduleRunner(clock);
  const responder = new PartyCommand({
    factory,
    clock,
    scheduleRunner,
    random
  });

  const fn = jest.fn();
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['typo']
    })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['partyichiyo']
    })
  );
  await responder.on(
    'DELETE',
    createMockMessage({
      args: ['party']
    })
  );
  expect(fn).not.toHaveBeenCalled();

  scheduleRunner.killAll();
});

test('party enable but must cancel', async () => {
  const factory = new MockVoiceConnectionFactory();
  const clock = new MockClock(new Date(0));
  const scheduleRunner = new ScheduleRunner(clock);
  const responder = new PartyCommand({
    factory,
    clock,
    scheduleRunner,
    random
  });

  const fn = jest.fn();
  const reply = jest.fn<Promise<SentMessage>, [EmbedMessage]>(() =>
    Promise.resolve({ edit: fn })
  );
  await responder.on(
    'CREATE',
    createMockMessage({
      args: ['party', 'enable'],
      reply,
      senderVoiceChannelId: null
    })
  );
  const nextTriggerMs = (random.minutes() + 1) * 60 * 1000;
  clock.placeholder = new Date(nextTriggerMs);
  scheduleRunner.consume();
  const oneHoursAgo = (random.minutes() + 61) * 60 * 1000;
  clock.placeholder = new Date(oneHoursAgo);
  scheduleRunner.consume();

  expect(reply).toHaveBeenNthCalledWith(1, {
    title: 'ゲリラを有効化しておいたよ。'
  });
  expect(reply).toHaveBeenNthCalledWith(2, {
    title: 'Party安全装置が作動したよ。',
    description:
      '起動した本人がボイスチャンネルに居ないのでキャンセルしておいた。悪く思わないでね。'
  });
  expect(reply).toHaveBeenCalledTimes(2);
  expect(fn).not.toHaveBeenCalled();

  scheduleRunner.killAll();
});
