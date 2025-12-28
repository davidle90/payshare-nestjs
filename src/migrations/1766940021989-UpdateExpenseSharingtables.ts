import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExpenseSharingtables1766940021989 implements MigrationInterface {
    name = 'UpdateExpenseSharingtables1766940021989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_3e5276c441c4db9113773113136"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_06e076479515578ab1933ab4375"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD "memberId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD "memberId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "editedByUserId" character varying`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "createdByUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD "isSettled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD "settledAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_group" ADD "referenceId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_group" ADD CONSTRAINT "UQ_add783a3607d574282fdea67ae7" UNIQUE ("referenceId")`);
        await queryRunner.query(`ALTER TABLE "expense_group" ADD "totalExpenses" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "expense_group" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_group" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_4b2f7a2403eeec93171882343a1"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ALTER COLUMN "groupId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_d95277f4bed70cc69711567c3c8"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ALTER COLUMN "amountPaid" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ALTER COLUMN "amountOwed" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "totalAmount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP COLUMN "groupId"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD "groupId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ALTER COLUMN "amount" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c99d8dd88487e2d142cacd6319" ON "expense_debt" ("groupId", "fromUserId", "toUserId") `);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_4b2f7a2403eeec93171882343a1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_d95277f4bed70cc69711567c3c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_3e5276c441c4db9113773113136" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_f18a437c394d99c52e59db6354d" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD CONSTRAINT "FK_9abdf5fe1b01edc03ef906c1281" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP CONSTRAINT "FK_9abdf5fe1b01edc03ef906c1281"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_f18a437c394d99c52e59db6354d"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_3e5276c441c4db9113773113136"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP CONSTRAINT "FK_d95277f4bed70cc69711567c3c8"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_4b2f7a2403eeec93171882343a1"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c99d8dd88487e2d142cacd6319"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ALTER COLUMN "amount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP COLUMN "groupId"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" ADD "groupId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "totalAmount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ALTER COLUMN "amountOwed" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "expense_participant" ADD CONSTRAINT "FK_e3b74771f38700ed6f11dc1912a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ALTER COLUMN "amountPaid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" ADD CONSTRAINT "FK_d95277f4bed70cc69711567c3c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ALTER COLUMN "groupId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_4b2f7a2403eeec93171882343a1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expense_group" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "expense_group" DROP COLUMN "totalExpenses"`);
        await queryRunner.query(`ALTER TABLE "expense_group" DROP CONSTRAINT "UQ_add783a3607d574282fdea67ae7"`);
        await queryRunner.query(`ALTER TABLE "expense_group" DROP COLUMN "referenceId"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP COLUMN "settledAt"`);
        await queryRunner.query(`ALTER TABLE "expense_debt" DROP COLUMN "isSettled"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "createdByUserId"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "editedByUserId"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "expense_participant" DROP COLUMN "memberId"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "expense_contributor" DROP COLUMN "memberId"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "expense" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_3e5276c441c4db9113773113136" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_group_member" ADD CONSTRAINT "FK_aef4dc0efdd8ab14837377401ec" FOREIGN KEY ("groupId") REFERENCES "expense_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
