import { EntityManager, In, MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../role/role.entity';
import { RolesData } from '../role/data/role.data';
import { plainToClass } from 'class-transformer';
import { User } from '../users/user.entity';

export class fillUsers1598066104418 implements MigrationInterface {
  private async getRole(manager: EntityManager, name: string): Promise<Role> {
    return await manager.findOne(Role, { name });
  }

  private async generateData(manager: EntityManager): Promise<any[]> {
    return [
      {
        name: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        role: await this.getRole(manager, RolesData.Admin),
        isAdmin: true,
      },
    ];
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    const manager = queryRunner.manager;
    let usersData = await this.generateData(manager);
    let users = plainToClass(User, usersData);
    return await manager.save(User, users);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.manager.delete(User, {
      name: In(['admin']),
    });
  }
}
