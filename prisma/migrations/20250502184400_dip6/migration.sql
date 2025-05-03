/*
  Warnings:

  - You are about to drop the column `team_id` on the `task` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "team";

-- AlterTable
ALTER TABLE "task" DROP COLUMN "team_id";

-- AlterTable
ALTER TABLE "team" ADD COLUMN     "project_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "team" ADD CONSTRAINT "project" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
