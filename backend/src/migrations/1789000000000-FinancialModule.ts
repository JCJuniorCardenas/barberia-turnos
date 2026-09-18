import { MigrationInterface, QueryRunner } from 'typeorm';

export class FinancialModule1789000000000 implements MigrationInterface {
  name = 'FinancialModule1789000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."turnos_estado_enum" ADD VALUE IF NOT EXISTS 'completado'`);
    await queryRunner.query(`ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "rol" character varying(20) NOT NULL DEFAULT 'admin'`);
    await queryRunner.query(`CREATE TYPE "public"."movimientos_financieros_tipo_enum" AS ENUM('ingreso', 'egreso')`);
    await queryRunner.query(`CREATE TABLE "movimientos_financieros" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tipo" "public"."movimientos_financieros_tipo_enum" NOT NULL, "monto" numeric(12,2) NOT NULL, "concepto" character varying(200) NOT NULL, "fecha" date NOT NULL, "turno_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_movimientos_turno_id" UNIQUE ("turno_id"), CONSTRAINT "PK_movimientos_financieros_id" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "movimientos_financieros" ADD CONSTRAINT "FK_movimientos_turno" FOREIGN KEY ("turno_id") REFERENCES "turnos"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "movimientos_financieros" DROP CONSTRAINT "FK_movimientos_turno"`);
    await queryRunner.query(`DROP TABLE "movimientos_financieros"`);
    await queryRunner.query(`DROP TYPE "public"."movimientos_financieros_tipo_enum"`);
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "rol"`);
  }
}
