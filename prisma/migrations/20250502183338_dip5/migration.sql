/*
  Warnings:

  - You are about to drop the `task_team` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_team" DROP CONSTRAINT "task";

-- DropForeignKey
ALTER TABLE "task_team" DROP CONSTRAINT "team";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "task_team";

-- DropTable
DROP TABLE "task_team";

-- CreateTable
CREATE TABLE "task_worker" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "user_team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_worker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "task_worker" ADD CONSTRAINT "user_team" FOREIGN KEY ("user_team_id") REFERENCES "user_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_worker" ADD CONSTRAINT "team" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_worker" ADD CONSTRAINT "task" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
