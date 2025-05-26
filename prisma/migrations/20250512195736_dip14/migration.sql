/*
  Warnings:

  - You are about to drop the `task_worker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_worker" DROP CONSTRAINT "task";

-- DropForeignKey
ALTER TABLE "task_worker" DROP CONSTRAINT "team";

-- DropForeignKey
ALTER TABLE "task_worker" DROP CONSTRAINT "user_team";

-- AlterTable
ALTER TABLE "work_time" ADD COLUMN     "description" VARCHAR;

-- DropTable
DROP TABLE "task_worker";
