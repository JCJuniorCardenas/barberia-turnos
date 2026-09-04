import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1788493243789 implements MigrationInterface {
    name = 'Migration1788493243789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(180) NOT NULL, "password_hash" character varying NOT NULL, CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "horarios_atencion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dia_semana" smallint NOT NULL, "hora_inicio" TIME NOT NULL, "hora_fin" TIME NOT NULL, "cerrado" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_59c09777ebfa1f4441821925ede" UNIQUE ("dia_semana"), CONSTRAINT "PK_e029febcc71796081d8a93ac028" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "servicios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(100) NOT NULL, "duracion_minutos" integer NOT NULL, "precio" numeric(10,2) NOT NULL, CONSTRAINT "PK_fefcdbfeaf506ca485a6dcfb0d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."turnos_estado_enum" AS ENUM('pendiente', 'confirmado', 'cancelado')`);
        await queryRunner.query(`CREATE TABLE "turnos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "servicio_id" uuid NOT NULL, "nombre_cliente" character varying(120) NOT NULL, "telefono_cliente" character varying(30) NOT NULL, "fecha" date NOT NULL, "hora" TIME NOT NULL, "estado" "public"."turnos_estado_enum" NOT NULL DEFAULT 'pendiente', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_61dbaea0fc136ee2ef981f14782" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "turnos" ADD CONSTRAINT "FK_dd64b3e0449c2ee441387fe1245" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "turnos" DROP CONSTRAINT "FK_dd64b3e0449c2ee441387fe1245"`);
        await queryRunner.query(`DROP TABLE "turnos"`);
        await queryRunner.query(`DROP TYPE "public"."turnos_estado_enum"`);
        await queryRunner.query(`DROP TABLE "servicios"`);
        await queryRunner.query(`DROP TABLE "horarios_atencion"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
