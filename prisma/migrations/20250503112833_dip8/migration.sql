/*
  Warnings:

  - You are about to drop the column `name` on the `team` table. All the data in the column will be lost.
  - You are about to drop the column `task_team_id` on the `user_team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "team" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "user_team" DROP COLUMN "task_team_id";
