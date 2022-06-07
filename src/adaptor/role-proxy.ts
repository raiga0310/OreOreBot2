import type { Client, Role } from 'discord.js';
import type { NewRole } from '../service/kawaemon-has-all-roles';
import type { RoleResponseRunner } from '../runner';
import type { Snowflake } from '../model/id';

type AllRoleModel = NewRole;

const map: (role: Role) => AllRoleModel = (role) => ({
  roleId: role.id as Snowflake,
  name: role.name
});

export const roleProxy = (
  client: Client,
  runner: RoleResponseRunner<AllRoleModel>
) => {
  client.on('roleCreate', (role) => runner.triggerEvent('CREATE', map(role)));
  client.on('roleUpdate', (_, role) =>
    runner.triggerEvent('UPDATE', map(role))
  );
};
