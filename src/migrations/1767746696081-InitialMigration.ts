import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1767746696081 implements MigrationInterface {
    name = 'InitialMigration1767746696081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inbox_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "message" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bbd15267b116fd3c45f459a65fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_group_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."expense_group_member_role_enum" NOT NULL DEFAULT 'member', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "groupId" uuid, "userId" uuid, CONSTRAINT "PK_fbf37fc246421e167501e938b22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_contributor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expenseId" uuid NOT NULL, "memberId" uuid, "userId" uuid NOT NULL, "amountPaid" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c4d3434011e9dd25dd85875f818" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6b3381774ae049704cbeac64b0" ON "expense_contributor" ("expenseId", "memberId") `);
        await queryRunner.query(`CREATE TABLE "expense_participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "expenseId" uuid NOT NULL, "memberId" uuid, "userId" uuid NOT NULL, "amountOwed" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a27328bd5ba66890f881d5a353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a2b4f062a54e56bc71a95507d2" ON "expense_participant" ("expenseId", "memberId") `);
        await queryRunner.query(`CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupId" uuid NOT NULL, "referenceId" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "totalAmount" numeric(10,2) NOT NULL DEFAULT '0', "category" character varying, "status" character varying NOT NULL DEFAULT 'draft', "isSettled" boolean NOT NULL DEFAULT false, "editedByUserId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdByUserId" uuid, CONSTRAINT "UQ_8dc971dfb1fd845f1049cc24244" UNIQUE ("referenceId"), CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "expense_debt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupId" uuid NOT NULL, "fromUserId" uuid, "toUserId" uuid, "amount" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_77d7d8afc23ec3eb88b69389fdd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c99d8dd88487e2d142cacd6319" ON "expense_debt" ("groupId", "fromUserId", "toUserId") `);
        await queryRunner.query(`CREATE TABLE "expense_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "referenceId" character varying NOT NULL, "name" character varying NOT NULL, "currency" character varying, "totalExpenses" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_add783a3607d574282fdea67ae7" UNIQUE ("referenceId"), CONSTRAINT "PK_b50aa03fde43af4d14eb84e6c2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_4b2f7a2403eeec93171882343a1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_d95277f4bed70cc69711567c3c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_545cadb0f79b3b48905af36277c" FOREIGN KEY ("memberId") REFERENCES "expense_group_member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_9787eb0190ba8355cbc15d5e76d" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_b9e460106a9199809f3b1408ac4" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_588c5b44076ac331de9fe013924" FOREIGN KEY ("memberId") REFERENCES "expense_group_member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_3e5276c441c4db9113773113136" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_f18a437c394d99c52e59db6354d" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD CONSTRAINT "FK_9abdf5fe1b01edc03ef906c1281" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD CONSTRAINT "FK_a46074c8836c45f83a9ab72e8f3" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD CONSTRAINT "FK_58c89662160bbc1c1c8ea4c3d72" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP CONSTRAINT "FK_58c89662160bbc1c1c8ea4c3d72"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP CONSTRAINT "FK_a46074c8836c45f83a9ab72e8f3"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP CONSTRAINT "FK_9abdf5fe1b01edc03ef906c1281"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_f18a437c394d99c52e59db6354d"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_3e5276c441c4db9113773113136"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_588c5b44076ac331de9fe013924"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_b9e460106a9199809f3b1408ac4"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_9787eb0190ba8355cbc15d5e76d"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_545cadb0f79b3b48905af36277c"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_d95277f4bed70cc69711567c3c8"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_4b2f7a2403eeec93171882343a1"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b23c65e50a758245a33ee35fda"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_87b8888186ca9769c960e92687"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "expense_group"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c99d8dd88487e2d142cacd6319"`);
        await queryRunner.query(`DROP TABLE "expense_debt"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2b4f062a54e56bc71a95507d2"`);
        await queryRunner.query(`DROP TABLE "expense_participant"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6b3381774ae049704cbeac64b0"`);
        await queryRunner.query(`DROP TABLE "expense_contributor"`);
        await queryRunner.query(`DROP TABLE "expense_group_member"`);
        await queryRunner.query(`DROP TABLE "inbox_message"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
