import type {
  MemberWithRole,
  MembersWithRoleRepository
} from '../../service/command/role-rank.js';
import type {
  UserStats,
  UserStatsRepository
} from '../../service/command/user-info.js';
import type { Client } from 'discord.js';
import type { MemberStats } from '../../service/command/kokusei-chousa.js';
import type { Snowflake } from '../../model/id.js';

export class DiscordMemberStats
  implements MemberStats, MembersWithRoleRepository, UserStatsRepository
{
  constructor(
    private readonly client: Client,
    private readonly guildId: Snowflake
  ) {}

  async allMemberCount(): Promise<number> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    return guild.memberCount;
  }

  async botMemberCount(): Promise<number> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const guildMemberList = await guild.members.list({ limit: 1000 });
    return guildMemberList.filter((member) => member.user.bot).size;
  }

  async fetchMembersWithRole(): Promise<MemberWithRole[]> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const guildMemberList = await guild.members.list({ limit: 1000 });
    return guildMemberList.map(({ displayName, roles }) => ({
      displayName,
      roles: roles.cache.size
    }));
  }

  async fetchStats(userId: string): Promise<UserStats | null> {
    const guild = await this.client.guilds.fetch(this.guildId);
    if (!guild.available) {
      throw new Error('guild unavailable');
    }
    const member = await guild.members.fetch(userId);
    if (!member) {
      return null;
    }

    const joinedAt: Date | undefined = member.joinedAt ?? undefined;
    const hoistRoleId = (member.roles.hoist?.id as Snowflake) ?? undefined;
    const createdAt = member.user.createdAt;

    return {
      color: member.displayColor.toString(16).padStart(6, '0'),
      displayName: member.displayName,
      joinedAt,
      createdAt,
      bot: member.user.bot,
      tag: member.user.tag,
      hoistRoleId: hoistRoleId
    };
  }
}
