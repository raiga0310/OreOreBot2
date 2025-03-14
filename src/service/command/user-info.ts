import type {
  CommandMessage,
  CommandResponder,
  HelpInfo
} from './command-message.js';

import type { Snowflake } from '../../model/id.js';
import { createTimestamp } from '../../model/create-timestamp.js';

export interface UserStats {
  color: string;
  displayName: string;
  joinedAt?: Date;
  createdAt: Date;
  bot: boolean;
  tag: string;
  hoistRoleId?: Snowflake | undefined;
}

export interface UserStatsRepository {
  fetchUserStats(userId: string): Promise<UserStats | null>;
}

const SCHEMA = {
  names: ['userinfo', 'user'],
  subCommands: {},
  params: [
    {
      type: 'USER',
      name: 'ユーザーID',
      description:
        'このIDのロールを調べるよ。何も入力しないと自分が対象になるよ。',
      defaultValue: 'me'
    }
  ]
} as const;

export class UserInfo implements CommandResponder<typeof SCHEMA> {
  help: Readonly<HelpInfo> = {
    title: 'ユーザー秘書艦',
    description:
      '指定したユーザーの情報を調べてくるよ。限界開発鯖のメンバーしか検索できないから注意してね。'
  };
  readonly schema = SCHEMA;

  constructor(private readonly repo: UserStatsRepository) {}

  async on(message: CommandMessage<typeof SCHEMA>): Promise<void> {
    const [arg] = message.args.params;
    const userId = fetchUserId(arg, message.senderId);

    if (typeof userId !== 'string') {
      await message.reply({
        title: 'コマンド形式エラー',
        description: '引数にユーザーIDの文字列を指定してね'
      });
      return;
    }

    const stats = await this.repo.fetchUserStats(userId);
    if (!stats) {
      await message.reply({
        title: '引数エラー',
        description: '指定したユーザーは存在しないよ'
      });
      return;
    }

    await message.reply(this.buildEmbed(stats, userId));
  }

  private buildEmbed(
    {
      color,
      displayName,
      joinedAt,
      createdAt,
      bot,
      tag,
      hoistRoleId
    }: UserStats,
    userId: string
  ) {
    const fields = [
      {
        name: 'ID',
        value: userId,
        inline: true
      },
      {
        name: '表示名',
        value: displayName,
        inline: true
      },
      {
        name: 'ユーザー名+Discord Tag',
        value: tag,
        inline: true
      },
      {
        name: 'プロフィールカラー',
        value: color,
        inline: true
      },
      {
        name: 'ユーザ種別',
        value: bot ? 'ボット' : '人類',
        inline: true
      },
      {
        name: 'メンバーリストの分類ロール',
        value: createHoistRoleDisplay(hoistRoleId),
        inline: true
      },
      {
        name: 'サーバー参加日時',
        value: createTimestamp(joinedAt),
        inline: true
      },
      {
        name: 'アカウント作成日時',
        value: createTimestamp(createdAt),
        inline: true
      }
    ];

    return {
      title: `ユーザーの情報`,
      description: `司令官、頼まれていた <@${userId}> の情報だよ`,
      fields
    };
  }
}

function fetchUserId(arg: string, senderId: string): string {
  if (arg === 'me') {
    return senderId;
  }
  return arg;
}
function createHoistRoleDisplay(hoistRoleId: Snowflake | undefined): string {
  if (!hoistRoleId) {
    return 'なし';
  }

  return `<@&${hoistRoleId}>`;
}
