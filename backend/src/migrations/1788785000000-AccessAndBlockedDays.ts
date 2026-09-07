import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccessAndBlockedDays1788785000000 implements MigrationInterface {
  name = 'AccessAndBlockedDays1788785000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "turnos" ADD "codigo_acceso" character varying(8)`);
    await queryRunner.query(`UPDATE "turnos" SET "codigo_acceso" = UPPER(SUBSTRING(MD5(RANDOM()::text || id::text), 1, 8)) WHERE "codigo_acceso" IS NULL`);
    await queryRunner.query(`ALTER TABLE "turnos" ALTER COLUMN "codigo_acceso" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "turnos" ADD CONSTRAINT "UQ_turnos_codigo_acceso" UNIQUE ("codigo_acceso")`);
    await queryRunner.query(`CREATE TABLE "dias_bloqueados" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fecha" date NOT NULL, "motivo" character varying(160), CONSTRAINT "UQ_dias_bloqueados_fecha" UNIQUE ("fecha"), CONSTRAINT "PK_dias_bloqueados_id" PRIMARY KEY ("id"))`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "dias_bloqueados"`);
    await queryRunner.query(`ALTER TABLE "turnos" DROP CONSTRAINT "UQ_turnos_codigo_acceso"`);
    await queryRunner.query(`ALTER TABLE "turnos" DROP COLUMN "codigo_acceso"`);
  }
}
