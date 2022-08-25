import { RoleCreate, RoleCreateManager } from './role-create.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockMessage } from './command-message.js';

describe('Create a role', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const manager: RoleCreateManager = {
    createRole: () => Promise.resolve()
  };
  const createRole = new RoleCreate(manager);

  it('create a role(command)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const newRoleColor = '141313'; //黒
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      'CREATE',
      createMockMessage(
        {
          args: ['rolecreate', newRoleName, newRoleColor]
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
    expect(createGuildRole).toHaveBeenCalledWith(
      newRoleName,
      newRoleColor,
      'Mikuroさいな'
    );
  });

  it('Missing argument(rolename)', async () => {
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      'CREATE',
      createMockMessage(
        {
          args: ['rolecreate']
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'コマンド形式エラー',
      description: '引数にロール名の文字列を指定してね'
    });
    expect(createGuildRole).not.toHaveBeenCalled();
  });

  it('Missing argument(rolecolor)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      'CREATE',
      createMockMessage(
        {
          args: ['rolecreate', newRoleName]
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'コマンド形式エラー',
      description:
        '引数にロールの色の[HEX](https://htmlcolorcodes.com/)を指定してね'
    });
    expect(createGuildRole).not.toHaveBeenCalled();
  });

  it('HEX Error (rolecolor)', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      'CREATE',
      createMockMessage(
        {
          args: ['rolecreate', newRoleName, 'fffffff']
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'コマンド形式エラー',
      description:
        '引数のHEXが6桁の16進数でないよ。HEXは`000000`から`FFFFFF`までの6桁の16進数だよ'
    });
    expect(createGuildRole).not.toHaveBeenCalled();
  });

  it('HEX sharp mark', async () => {
    const newRoleName = 'かわえもんのおねえさん';
    const createGuildRole = vi.spyOn(manager, 'createRole');
    const fn = vi.fn();

    await createRole.on(
      'CREATE',
      createMockMessage(
        {
          args: ['rolecreate', newRoleName, '#ffffff']
        },
        fn
      )
    );

    expect(fn).toHaveBeenCalledWith({
      title: 'ロール作成',
      description: 'ロールを作成したよ'
    });
    expect(createGuildRole).toHaveBeenCalledWith(
      newRoleName,
      'ffffff',
      'Mikuroさいな'
    );
  });
});
