import { RoleInfo, RoleStatsRepository } from './role-info.js';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createMockMessage } from './command-message.js';
import { parseStringsOrThrow } from '../../adaptor/proxy/command/schema.js';

describe('RoleRank', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const repo: RoleStatsRepository = {
    fetchStats: (id) =>
      Promise.resolve(
        id === '101'
          ? {
              color: '1a1d1a',
              createdAt: new Date(20200101),
              position: 1,
              numOfMembersBelonged: 3
            }
          : null
      )
  };
  const roleInfo = new RoleInfo(repo);

  it('gets info of role', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await roleInfo.on(
      createMockMessage(
        parseStringsOrThrow(['roleinfo', '101'], roleInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロールの情報',
      description: '司令官、頼まれていた <@&101> の情報だよ',
      fields: [
        {
          name: 'ID',
          value: '101',
          inline: true
        },
        {
          name: '所属人数',
          value: `3人`,
          inline: true
        },
        {
          name: 'ポジション',
          value: `1番目`,
          inline: true
        },
        {
          name: 'カラーコード',
          value: '1a1d1a',
          inline: true
        },
        {
          name: '作成日時',
          value: `<t:20200>(<t:20200:R>)`,
          inline: true
        }
      ],
      thumbnail: undefined
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });

  it('errors with invalid id', async () => {
    const fetchStats = vi.spyOn(repo, 'fetchStats');
    const fn = vi.fn();

    await roleInfo.on(
      createMockMessage(
        parseStringsOrThrow(['roleinfo', '100'], roleInfo.schema),
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: '引数エラー',
      description: '指定のIDのロールが見つからないみたい……'
    });
    expect(fetchStats).toHaveBeenCalledOnce();
  });
});
