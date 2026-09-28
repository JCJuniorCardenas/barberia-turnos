import { MigrationInterface, QueryRunner } from 'typeorm';

export class ServicioActivo1789100000000 implements MigrationInterface {
  name = 'ServicioActivo1789100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "servicios" ADD COLUMN IF NOT EXISTS "activo" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "servicios" DROP COLUMN "activo"`);
  }
}
