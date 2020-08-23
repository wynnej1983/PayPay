import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../role/role.entity';
import { RolesData } from '../role/data/role.data';
import { plainToClass } from 'class-transformer';

export class fillRoles1598066089664 implements MigrationInterface {
  private generateData(): any[] {
    return [
      { name: RolesData.Admin, isAdmin: true },
      { name: RolesData.Employee },
    ];
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    const manager = queryRunner.manager;
    let rolesData = this.generateData();
    let roles: Role[] = plainToClass(Role, rolesData);
    return await manager.save(Role, roles);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const manager = queryRunner.manager;
    let rolesData = this.generateData();
    return await manager.delete(Role, {
      name: In(rolesData.map((item) => item.name)),
    });
  }
}
