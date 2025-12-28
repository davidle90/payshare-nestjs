import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1766884450473 implements MigrationInterface {
    name = 'InitialMigration1766884450473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_contributor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expenseId" uuid NOT NULL, "userId" uuid NOT NULL, "amountPaid" numeric(10,2) NOT NULL, CONSTRAINT "PK_c4d3434011e9dd25dd85875f818" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_group_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupId" uuid NOT NULL, "userId" uuid NOT NULL, "role" character varying NOT NULL DEFAULT 'member', CONSTRAINT "PK_fbf37fc246421e167501e938b22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'active', CONSTRAINT "PK_b50aa03fde43af4d14eb84e6c2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expenseId" uuid NOT NULL, "userId" uuid NOT NULL, "amountOwed" numeric(10,2) NOT NULL, CONSTRAINT "PK_5a27328bd5ba66890f881d5a353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupId" uuid NOT NULL, "description" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "isSettled" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inbox_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bbd15267b116fd3c45f459a65fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL, "userId" uuid, "groupId" uuid, CONSTRAINT "PK_65634517a244b69a8ef338d03c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_debt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupId" character varying NOT NULL, "fromUserId" character varying NOT NULL, "toUserId" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_77d7d8afc23ec3eb88b69389fdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_9787eb0190ba8355cbc15d5e76d" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_d95277f4bed70cc69711567c3c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_4b2f7a2403eeec93171882343a1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_b9e460106a9199809f3b1408ac4" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_3e5276c441c4db9113773113136" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_member" ADD CONSTRAINT "FK_9f209c217eef89b8c32bd077903" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_member" ADD CONSTRAINT "FK_44c8964c097cf7f71434d6d1122" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "group_member" DROP CONSTRAINT "FK_44c8964c097cf7f71434d6d1122"`);
        await queryRunner.query(`ALTER TABLE "group_member" DROP CONSTRAINT "FK_9f209c217eef89b8c32bd077903"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_06e076479515578ab1933ab4375"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_3e5276c441c4db9113773113136"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_b9e460106a9199809f3b1408ac4"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_4b2f7a2403eeec93171882343a1"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_d95277f4bed70cc69711567c3c8"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_9787eb0190ba8355cbc15d5e76d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "expense_debt"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "group_member"`);
        await queryRunner.query(`DROP TABLE "inbox_message"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP TABLE "expense_participant"`);
        await queryRunner.query(`DROP TABLE "expense_group"`);
        await queryRunner.query(`DROP TABLE "expense_group_member"`);
        await queryRunner.query(`DROP TABLE "expense_contributor"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
