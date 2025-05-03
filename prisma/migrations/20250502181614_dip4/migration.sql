/*
  Warnings:

  - You are about to drop the column `comment` on the `task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task" DROP COLUMN "comment",
ADD COLUMN     "begin_date" TIMESTAMP(3),
ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "status_id" INTEGER,
ADD COLUMN     "task_team_id" INTEGER;

-- AlterTable
ALTER TABLE "user_team" ADD COLUMN     "task_team_id" INTEGER;

-- CreateTable
CREATE TABLE "status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_team" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_team_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "task_team" FOREIGN KEY ("task_team_id") REFERENCES "task_team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "status" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_team" ADD CONSTRAINT "team" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "task_team" ADD CONSTRAINT "task" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
